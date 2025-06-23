# 📚 StudyBuddy+ – Student Productivity Web App

StudyBuddy+ is a beautiful and lightweight full-stack web app that helps students stay productive by managing tasks, tracking daily progress through a calendar, and staying motivated with quotes — all secured with Firebase Authentication and backed by an Express.js API.

---

## ✨ Features

- ✅ **Firebase Authentication** – Secure login/signup with email and password
- ✅ **Task Manager** – Add, view, and delete tasks with automatic date tagging
- ✅ **Motivational Quotes** – Daily inspirational quotes on the dashboard
- ✅ **Calendar View** – View tasks based on specific past dates
- ✅ **Express.js Backend** – API for task CRUD operations
- ✅ **Modern UI** – Clean, mobile-friendly interface built with HTML, CSS, and JS

---

## 🧩 Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Frontend      | HTML, CSS, JavaScript       |
| Authentication| Firebase Authentication     |
| Backend       | Node.js + Express.js        |
| Storage       | In-memory / JSON (optional) |
| Hosting       | Localhost / Firebase-ready  |

---

## 📁 Folder Structure
studybuddy-plus/
├── public/
│ ├── css/
│ │ └── styles.css
│ ├── js/
│ │ ├── auth.js
│ │ ├── dashboard.js
│ │ ├── calendar.js
│ │ └── firebaseConfig.js
├── views/
│ ├── index.html
│ ├── dashboard.html
│ └── calendar.html
├── tasks.json # (optional)
├── server.js # Express backend
├── package.json
└── README.md

---

## 🚀 Getting Started

### 1. Clone the repository

bash
git clone https://github.com/Hemanthmuvvala/studybuddy.git
cd studybuddy-plus
### 2. Install dependencies
npm install
If using nodemon:
npm install --save-dev nodemon
### 3. Setup Firebase:
  // public/js/firebaseConfig.js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
};
#### 4. Run the development server
node server.js     # or
npm run dev       # if using nodemon
👤 Author
Muvvala Hemanth Venkata Naga Pavan Kumar.
📃 License
This project is open-source and available for personal and educational use.


