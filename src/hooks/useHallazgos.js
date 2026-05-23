import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export function useHallazgos() {
  const [hallazgos, setHallazgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHallazgos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "hallazgos"), orderBy("fechaCreacion", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setHallazgos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHallazgos();
  }, []);

  return { hallazgos, loading, error, refetch: fetchHallazgos };
}

export async function getHallazgo(id) {
  const snap = await getDoc(doc(db, "hallazgos", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function crearHallazgo(datos, uid) {
  const hallazgo = {
    ...datos,
    estado: "Abierto",
    reportadoPor: uid,
    responsable: null,
    accionCorrectiva: null,
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
    fechaCierre: null,
    historial: [
      {
        estado: "Abierto",
        usuario: uid,
        fecha: new Date().toISOString(),
        nota: "Hallazgo creado",
      },
    ],
  };
  const ref = await addDoc(collection(db, "hallazgos"), hallazgo);
  return ref.id;
}

export async function avanzarEstado(id, nuevoEstado, uid, nota, extras = {}) {
  const ref = doc(db, "hallazgos", id);
  const snap = await getDoc(ref);
  const data = snap.data();

  const historialActual = data.historial || [];
  const nuevaEntrada = {
    estado: nuevoEstado,
    usuario: uid,
    fecha: new Date().toISOString(),
    nota,
  };

  const update = {
    estado: nuevoEstado,
    fechaActualizacion: serverTimestamp(),
    historial: [...historialActual, nuevaEntrada],
    ...extras,
  };

  if (nuevoEstado === "Cerrado") {
    update.fechaCierre = serverTimestamp();
  }

  await updateDoc(ref, update);
}
