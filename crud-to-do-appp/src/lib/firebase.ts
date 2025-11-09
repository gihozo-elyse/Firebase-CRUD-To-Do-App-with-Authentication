
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDfAL-z7bLYmwYtliwmfJCG6mEjrIqeSgc",
  authDomain: "authentication-b4d8a.firebaseapp.com",
  projectId: "authentication-b4d8a",
  storageBucket: "authentication-b4d8a.firebasestorage.app",
  messagingSenderId: "976605819229",
  appId: "1:976605819229:web:fa94145a81b7a000d238b4",
  measurementId: "G-22NSBR16D7"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


export const auth = getAuth(app);
export const db = getFirestore(app);
