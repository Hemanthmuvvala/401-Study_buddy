// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAM62Q4zNrVAELRqBxUfOvXLi6z-b7oF3k",
    authDomain: "capstone-75d46.firebaseapp.com",
    projectId: "capstone-75d46",
    storageBucket: "capstone-75d46.firebasestorage.app",
    messagingSenderId: "1085151937790",
    appId: "1:1085151937790:web:6963515202dae71a4311af",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);