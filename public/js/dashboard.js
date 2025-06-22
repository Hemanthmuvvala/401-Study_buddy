import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const usernameDisplay = document.getElementById("username");
const authMessage = document.getElementById("authMessage");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDescription = document.getElementById("taskDescription");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskList = document.getElementById("taskList");
const quoteText = document.getElementById("quoteText");

let currentUser = null;

async function fetchQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        if (!response.ok) {
            throw new Error("Failed to fetch quote");
        }
        const data = await response.json();
        quoteText.textContent = data.content + " - " + data.author;
    } catch (error) {
        console.error("Error fetching quote:", error);
        quoteText.textContent = "Failed to load a quote.";
    }
}

function getTasks(uid) {
    return JSON.parse(localStorage.getItem(`${uid}_tasks`) || "[]");
}

function saveTasks(uid, tasks) {
    localStorage.setItem(`${uid}_tasks`, JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";
    if (!currentUser) {
        taskList.innerHTML = "<li>Please log in to view your tasks.</li>";
        return;
    }

    const tasks = getTasks(currentUser.uid);
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `${task.text} (Due: ${task.date} ${task.time}) - ${task.description} <button class="delete-task-btn" data-id="${task.id}">Delete</button>`;
        taskList.appendChild(li);
    });

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
    displayTasks();
}

async function createCalendarEvent(title, description, date, time) {
    const formattedDate = date.split('-').join('');
    const formattedTime = time.replace(':', '');
    const startDateTime = `${formattedDate}T${formattedTime}00`;

    try {
        const response = await fetch('/create-calendar-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                start_date: date,
                start_time_of_day: time,
                duration: '1h',
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Calendar event created:', result);
        alert('Task added and calendar event created successfully!');
    } catch (error) {
        console.error('Error creating calendar event:', error);
        alert('Failed to create calendar event.  Task added, but calendar entry may be missing.');
    }
}

if (taskForm) {
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Please log in to add tasks.");
            return;
        }

        const text = taskInput.value.trim();
        const description = taskDescription.value.trim();
        const date = taskDate.value;
        const time = taskTime.value;

        if (!text || !description || !date || !time) {
            alert("Please fill in all task details.");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            description: description,
            date: date,
            time: time,
            completed: false,
        };

        const tasks = getTasks(currentUser.uid);
        tasks.push(newTask);
        saveTasks(currentUser.uid, tasks);

        await createCalendarEvent(text, description, date, time);

        taskInput.value = "";
        taskDescription.value = "";
        taskDate.value = "";
        taskTime.value = "";
        displayTasks();
    });
}

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        usernameDisplay.textContent = user.displayName || "Student";
        authMessage.style.display = "none";
        taskForm.querySelectorAll("input, textarea, button").forEach(el => el.removeAttribute("disabled"));
        displayTasks();
        fetchQuote();
    } else {
        usernameDisplay.textContent = "Student";
        authMessage.style.display = "block";
        authMessage.textContent = "Please log in to add and view tasks.";
        taskForm.querySelectorAll("input, textarea, button").forEach(el => el.setAttribute("disabled", ""));
        taskList.innerHTML = "<li>Please log in to view your tasks.</li>";
    }
});