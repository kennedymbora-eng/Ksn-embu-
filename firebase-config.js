// firebase-config.js
// Get these values from Firebase Console > Project Settings > Your apps > SDK setup
// Create a project at https://console.firebase.google.com if you haven't already.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyALZNTbGdVDSOEEca7IXQbOkNqHxhJ98b8",
  authDomain: "ksn-embu.firebaseapp.com",
  projectId: "ksn-embu",
  storageBucket: "ksn-embu.firebasestorage.app",
  messagingSenderId: "354031009947",
  appId: "1:354031009947:web:beb173f741f02e2ad6063e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
