// public/js/calendar.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Elements
const calendarTable = document.getElementById("calendarTable");
const selectedDateLabel = document.getElementById("selectedDateLabel");
const tasksListByDate = document.getElementById("tasksListByDate");

// Check user
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
  else generateCalendar(new Date());
});

// Generate calendar grid for current month
function generateCalendar(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = "<tr>";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach((day) => (html += `<th>${day}</th>`));
  html += "</tr><tr>";

  for (let i = 0; i < firstDay; i++) {
    html += "<td></td>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = `${year}-${pad(month + 1)}-${pad(day)}`;
    html += `<td class="calendar-day" data-date="${fullDate}">${day}</td>`;

    if ((firstDay + day) % 7 === 0) html += "</tr><tr>";
  }

  html += "</tr>";
  calendarTable.innerHTML = html;

  // Highlight today's date
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll(".calendar-day").forEach((cell) => {
    if (cell.dataset.date === today) {
      cell.style.backgroundColor = "#ffeaa7";
      cell.style.fontWeight = "bold";
    }

    cell.addEventListener("click", () => {
      const selectedDate = cell.dataset.date;
      selectedDateLabel.textContent = selectedDate;
      loadTasksForDate(selectedDate);
    });
  });
}

// Pad date numbers
function pad(num) {
  return num.toString().padStart(2, "0");
}

// Load tasks from localStorage for a specific date
function loadTasksForDate(date) {
  const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const filtered = allTasks.filter((task) => task.date === date);

  tasksListByDate.innerHTML = "";
  if (filtered.length === 0) {
    tasksListByDate.innerHTML = "<li>No tasks found</li>";
    return;
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    tasksListByDate.appendChild(li);
  });
}
