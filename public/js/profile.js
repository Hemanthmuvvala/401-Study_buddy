import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const profileAuthMessage = document.getElementById("profileAuthMessage");
const profileDetails = document.getElementById("profileDetails");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAge = document.getElementById("profileAge");
const profileWork = document.getElementById("profileWork");
const recentTasksList = document.getElementById("recentTasksList");
const completedTasksCount = document.getElementById("completedTasksCount");

let currentUser = null;

function getTasks(uid) {
  return JSON.parse(localStorage.getItem(`${uid}_tasks`) || "[]");
}

function saveTasks(uid, tasks) {
  localStorage.setItem(`${uid}_tasks`, JSON.stringify(tasks));
}

function loadProfileAndTasks() {
  if (!currentUser) {
    profileAuthMessage.style.display = "block";
    profileDetails.style.display = "none";
    recentTasksList.innerHTML = "<li>Please log in to view your tasks.</li>";
    completedTasksCount.textContent = "N/A";
    return;
  }

  profileAuthMessage.style.display = "none";
  profileDetails.style.display = "block";

  profileName.textContent = currentUser.displayName || "N/A";
  profileEmail.textContent = currentUser.email || "N/A";
  profileAge.textContent = localStorage.getItem(`${currentUser.uid}_age`) || "N/A";
  profileWork.textContent = localStorage.getItem(`${currentUser.uid}_work`) || "N/A";

  const allTasks = getTasks(currentUser.uid);

  if (allTasks.length === 0) {
    const dummyTasks = [
      { id: Date.now(), text: "Finish Math Homework", description: "Solve differential equations", date: "2025-06-23", time: "16:00", completed: false },
      { id: Date.now() + 1, text: "Read Chapter 3 of History", description: "Focus on the causes of WWI", date: "2025-06-24", time: "10:00", completed: false },
      { id: Date.now() + 2, text: "Prepare for Science Quiz", description: "Review chemical reactions", date: "2025-06-25", time: "14:00", completed: true },
      { id: Date.now() + 3, text: "Write essay draft", description: "Outline and introduction", date: "2025-06-23", time: "19:00", completed: false },
      { id: Date.now() + 4, text: "Review English grammar", description: "Focus on punctuation", date: "2025-06-26", time: "09:00", completed: true },
    ];
    saveTasks(currentUser.uid, dummyTasks);
    allTasks.push(...dummyTasks);
  }

  recentTasksList.innerHTML = "";
  if (allTasks.length === 0) {
    recentTasksList.innerHTML = "<li>No tasks found.</li>";
  } else {
    allTasks.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    allTasks.slice(0, 5).forEach(task => {
      const li = document.createElement("li");
      li.innerHTML = `${task.text} (Due: ${task.date} ${task.time}) - ${task.description} <button class="delete-task-btn" data-id="${task.id}">Delete</button>`;
      recentTasksList.appendChild(li);
    });
  }

  const completedTasks = allTasks.filter(task => task.completed);
  completedTasksCount.textContent = completedTasks.length;

  document.querySelectorAll(".delete-task-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const taskIdToDelete = parseInt(e.target.dataset.id);
      deleteTask(taskIdToDelete);
    });
  });
}

function deleteTask(id) {
  const allTasks = getTasks(currentUser.uid);
  const updatedTasks = allTasks.filter(task => task.id !== id);
  saveTasks(currentUser.uid, updatedTasks);
  loadProfileAndTasks();
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  loadProfileAndTasks();
});