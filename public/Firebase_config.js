// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7GAM5OwDmnSWgSquR5naML_A9DbL9Agw",
  authDomain: "quickbuzz-e7fa2.firebaseapp.com",
  databaseURL: "https://quickbuzz-e7fa2-default-rtdb.firebaseio.com",
  projectId: "quickbuzz-e7fa2",
  storageBucket: "quickbuzz-e7fa2.firebasestorage.app",
  messagingSenderId: "478090499846",
  appId: "1:478090499846:web:ee4c9e0dd1bc873300b087",
  measurementId: "G-PC64VHQ7K5"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);