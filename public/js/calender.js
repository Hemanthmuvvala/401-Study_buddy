import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const calendarTable = document.getElementById("calendarTable");
const selectedDateLabel = document.getElementById("selectedDateLabel");
const tasksListByDate = document.getElementById("tasksListByDate");
const calendarAuthMessage = document.getElementById("calendarAuthMessage");
const tasksForDateHeader = document.getElementById("tasksForDateHeader");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    if (calendarTable) {
      calendarTable.innerHTML = "<tr><td>Please log in to view the calendar.</td></tr>";
    }
    selectedDateLabel.textContent = "N/A";
    tasksListByDate.innerHTML = "<li>Please log in to view tasks for dates.</li>";
    calendarAuthMessage.style.display = "block";
    calendarAuthMessage.textContent = "Please log in to view and manage your study calendar.";
    tasksForDateHeader.style.display = "none";
  } else {
    generateCalendar(new Date());
    selectedDateLabel.textContent = "Select a date";
    tasksListByDate.innerHTML = "<li>No date selected.</li>";
    calendarAuthMessage.style.display = "none";
    tasksForDateHeader.style.display = "block";
  }
});

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
  if (calendarTable) {
    calendarTable.innerHTML = html;
  }

  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll(".calendar-day").forEach((cell) => {
    if (cell.dataset.date === today) {
      cell.classList.add("today");
    }

    cell.addEventListener("click", () => {
      const selectedDate = cell.dataset.date;
      selectedDateLabel.textContent = selectedDate;
      loadTasksForDate(selectedDate);
    });
  });
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

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