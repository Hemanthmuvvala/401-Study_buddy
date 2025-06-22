// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views/dashboard.html"));
});

app.get("/calendar", (req, res) => {
  res.sendFile(path.join(__dirname, "views/calender.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "views/profile.html"));
});

// server.js
// ... (existing imports and setup) ...

app.get("/progress", (req, res) => {
  res.sendFile(path.join(__dirname, "views/progress.html"));
});

// ... (rest of your server.js code) ...

// Mock storage (use tasks.json or DB in future)
let tasks = [];

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
  const { text, date } = req.body;
  if (!text || !date) {
    return res.status(400).json({ error: "Task text and date required" });
  }
  const task = { id: Date.now(), text, date };
  tasks.push(task);
  res.status(201).json(task);
});
// server.js
// ... (existing imports and setup) ...

app.post('/create-calendar-event', async (req, res) => {
  const { title, description, start_date, start_time_of_day, duration } = req.body;

  //  Call the calendar API here.  Replace with your actual API call.
  //  This is a placeholder.
  console.log('Received calendar event creation request:', req.body);
  //  For example, if you had a calendar API function:
  //  const calendarResult = await calendarAPI.createEvent(title, description, start_date, start_time_of_day, duration);

  //  For this example, we'll just send back a success message.
  res.json({ message: 'Calendar event creation simulated successfully.' });
});

// ... (existing routes) ...
// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.status(200).json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`🚀 StudyBuddy+ server running at http://localhost:${PORT}`);
});
