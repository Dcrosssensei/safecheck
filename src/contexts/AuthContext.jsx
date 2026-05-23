import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          const data = snap.exists() ? snap.data() : {};
          setUser(firebaseUser);
          setRol(data.rol || null);
          setUserData(data);
        } catch {
          // Firestore inaccesible: el usuario Auth existe pero sin datos de rol
          setUser(firebaseUser);
          setRol(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setRol(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, nombre, rol = "inspector") => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await setDoc(doc(db, "users", user.uid), {
        nombre,
        email,
        rol,
        creadoEn: serverTimestamp(),
      });
    } catch (firestoreError) {
      // Si Firestore falla, eliminar el usuario de Auth para permitir reintento limpio
      await user.delete();
      throw firestoreError;
    }
    return user;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, rol, userData, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
