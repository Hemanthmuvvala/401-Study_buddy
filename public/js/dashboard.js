// public/js/dashboard.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// 🌟 Quotes
const quotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Your future is created by what you do today, not tomorrow.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Discipline is choosing between what you want now and what you want most."
];

// DOM
const usernameSpan = document.getElementById("username");
const quoteText = document.getElementById("quoteText");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const logoutBtn = document.getElementById("logoutBtn");

// ✅ Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    usernameSpan.textContent = user.displayName || "Student";
    showQuote();
    loadTasks();
  } else {
    window.location.href = "/";
  }
});

// ✅ Quote of the Day
function showQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = quotes[random];
}

// ✅ Load tasks from Express API
async function loadTasks() {
  taskList.innerHTML = "<li>Loading tasks...</li>";
  try {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();

    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter((task) => task.date === today);

    taskList.innerHTML = "";
    if (todayTasks.length === 0) {
      taskList.innerHTML = "<li>No tasks for today!</li>";
      return;
    }

    todayTasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = task.text;

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.onclick = () => deleteTask(task.id);
      li.appendChild(delBtn);

      taskList.appendChild(li);
    });
  } catch (error) {
    taskList.innerHTML = "<li>Error loading tasks</li>";
    console.error(error);
  }
}

// ✅ Add new task (POST)
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const today = new Date().toISOString().split("T")[0];

  if (!taskText) return;

  try {
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: taskText, date: today })
    });
    taskInput.value = "";
    loadTasks();
  } catch (err) {
    alert("Error adding task");
    console.error(err);
  }
});

// ✅ Delete task (DELETE)
async function deleteTask(id) {
  try {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  } catch (err) {
    alert("Error deleting task");
    console.error(err);
  }
}

// ✅ Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => (window.location.href = "/"))
    .catch((error) => alert("Logout failed: " + error.message));
});
