import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBmnvzg9WfcVl71_HFUQTryXgI0uhUuhjs",
  authDomain: "project-9463f.firebaseapp.com",
  projectId: "project-9463f",
  storageBucket: "project-9463f.firebasestorage.app",
  messagingSenderId: "1025095293094",
  appId: "1:1025095293094:web:bbbcbabf56c4f78a867c67",
  measurementId: "G-40P3K6GPJ6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);