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
  res.sendFile(path.join(__dirname, "views/calendar.html"));
});

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

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.status(200).json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`🚀 StudyBuddy+ server running at http://localhost:${PORT}`);
});
