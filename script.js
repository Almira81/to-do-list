// 🌗 THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// 🧠 TASK STORAGE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🗓️ DATE
const today = new Date();
document.getElementById("dayName").textContent =
  today.toLocaleDateString("en-US", { weekday: "long" });
document.getElementById("dayNumber").textContent = today.getDate();
document.getElementById("monthName").textContent =
  today.toLocaleDateString("en-US", { month: "long" });

// 📋 ELEMENTS
const addBtn = document.getElementById("addBtn");
const newTask = document.getElementById("newTask");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");

// ➕ ADD TASK
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const text = newTask.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  });

  newTask.value = "";
  saveTasks();
  renderTasks();
});

// 🎨 RENDER TASKS
function renderTasks() {
  taskList.innerHTML = "";
  let done = 0;

  tasks.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    if (task.completed) {
      taskEl.classList.add("completed");
      done++;
    }

    taskEl.innerHTML = `
      <span>${task.text}</span>
      <button class="deleteBtn">✕</button>
    `;

    taskEl.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    taskEl.querySelector(".deleteBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(taskEl);
  });

  progressText.textContent = `${done} / ${tasks.length} tasks done`;
}

// 🔄 INIT
renderTasks();

// 📱 SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .catch(() => {});
}
