import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlcb6g2jA-6qs242uvVg0njz1w2lFp2IA",
  authDomain: "safecheck-7839c.firebaseapp.com",
  projectId: "safecheck-7839c",
  storageBucket: "safecheck-7839c.firebasestorage.app",
  messagingSenderId: "439452352016",
  appId: "1:439452352016:web:3ef014aa8fc05eac35d495",
  measurementId: "G-J2B5DKX4R2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
