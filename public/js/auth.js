import { auth } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutBtn = document.getElementById("logoutBtn");

function displayError(message) {
  alert("Error: " + message);
}

onAuthStateChanged(auth, (user) => {
  if (logoutBtn) {
    if (user) {
      logoutBtn.style.display = "block";
    } else {
      logoutBtn.style.display = "none";
    }
  }
});

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = signupForm.signupName.value;
    const age = signupForm.signupAge.value;
    const work = signupForm.signupWork.value;
    const email = signupForm.signupEmail.value;
    const password = signupForm.signupPassword.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      localStorage.setItem(`${userCredential.user.uid}_age`, age);
      localStorage.setItem(`${userCredential.user.uid}_work`, work);
      
      alert("Signup successful! You are now logged in.");
      window.location.href = "/dashboard";
    } catch (error) {
      displayError(error.message);
      console.error(error);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      displayError(error.message);
      console.error(error);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      displayError(error.message);
      console.error(error);
    }
  });
}