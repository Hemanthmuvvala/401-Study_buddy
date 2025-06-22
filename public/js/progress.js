import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const progressAuthMessage = document.getElementById("progressAuthMessage");
const progressDetails = document.getElementById("progressDetails");
const totalPostsCount = document.getElementById("totalPostsCount");
const completedPostsCount = document.getElementById("completedPostsCount");
const inProgressPostsCount = document.getElementById("inProgressPostsCount");
const allPostsList = document.getElementById("allPostsList");

let currentUser = null;

function getTasks(uid) {
  return JSON.parse(localStorage.getItem(`${uid}_tasks`) || "[]");
}

function saveTasks(uid, tasks) {
  localStorage.setItem(`${uid}_tasks`, JSON.stringify(tasks));
}

function loadProgress() {
  if (!currentUser) {
    progressAuthMessage.style.display = "block";
    progressDetails.style.display = "none";
    allPostsList.innerHTML = "<li>Please log in to view your progress.</li>";
    totalPostsCount.textContent = "N/A";
    completedPostsCount.textContent = "N/A";
    inProgressPostsCount.textContent = "N/A";
    return;
  }

  progressAuthMessage.style.display = "none";
  progressDetails.style.display = "block";

  const allTasks = getTasks(currentUser.uid);

  const total = allTasks.length;
  const completed = allTasks.filter(task => task.completed).length;
  const inProgress = total - completed;

  totalPostsCount.textContent = total;
  completedPostsCount.textContent = completed;
  inProgressPostsCount.textContent = inProgress;

  allPostsList.innerHTML = "";
  if (total === 0) {
    allPostsList.innerHTML = "<li>No study entries found.</li>";
  } else {
    allTasks.forEach(task => {
      const status = task.completed ? "Completed" : "In Progress";
      const li = document.createElement("li");
      li.innerHTML = `${task.text} (Date: ${task.date} ${task.time}, Status: ${status}) - ${task.description} <button class="delete-post-btn" data-id="${task.id}">Delete</button>`;
      allPostsList.appendChild(li);
    });
  }

  document.querySelectorAll(".delete-post-btn").forEach(button => {
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
  loadProgress();
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  loadProgress();
});