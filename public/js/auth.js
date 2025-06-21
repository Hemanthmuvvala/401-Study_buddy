// public/js/auth.js
import { auth } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ----- SIGNUP -----
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: name });
      alert("Signup successful! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(`Signup error: ${error.message}`);
    }
  });
}

// ----- LOGIN -----
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(`Login error: ${error.message}`);
    }
  });
}
