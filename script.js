function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// THEME
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
});

// 🧠 STORAGE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const todayList = document.getElementById("todayList");
const olderList = document.getElementById("olderList");
const progressText = document.getElementById("progressText");

// 🗓️ DATE
const today = new Date();
document.getElementById("dayName").textContent =
  today.toLocaleDateString("en-US", { weekday: "long" });
document.getElementById("dayNumber").textContent = today.getDate();
document.getElementById("monthName").textContent =
  today.toLocaleDateString("en-US", { month: "long" });

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ➕ ADD TASK
document.getElementById("addBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const text = document.getElementById("newTask").value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    date: todayISO(),
  });

  document.getElementById("newTask").value = "";
  saveTasks();
  renderTasks();
});

// 🎨 RENDER
function renderTasks() {
  todayList.innerHTML = "";
  olderList.innerHTML = "";

  let done = 0;
  const todayStr = todayISO();

  tasks.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    if (task.completed) {
      taskEl.classList.add("completed");
      done++;
    }

    taskEl.innerHTML = `
      <span>${task.text}</span>
      <button>✕</button>
    `;

    taskEl.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    taskEl.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    if (task.date === todayStr) {
      todayList.appendChild(taskEl);
    } else {
      olderList.appendChild(taskEl);
    }
  });

  progressText.textContent = `${done} / ${tasks.length} tasks done`;
}

renderTasks();

