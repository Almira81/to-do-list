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

// STORAGE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const todayList = document.getElementById("todayList");
const olderList = document.getElementById("olderList");
const progressText = document.getElementById("progressText");

// DATE
const today = new Date();
document.getElementById("dayName").textContent =
  today.toLocaleDateString("en-US", { weekday: "long" });
document.getElementById("dayNumber").textContent = today.getDate();
document.getElementById("monthName").textContent =
  today.toLocaleDateString("en-US", { month: "long" });

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
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
let streak = Number(localStorage.getItem("streak")) || 0;
let lastCompletedDate = localStorage.getItem("lastCompletedDate");

function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function updateStreak() {
  const today = todayISO();
  const completedToday = tasks.some(
    (t) => t.completed && t.date === today
  );

  if (!completedToday) return;

  if (lastCompletedDate === today) return;

  if (!lastCompletedDate) {
    streak = 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yISO = yesterday.toISOString().split("T")[0];

    streak = lastCompletedDate === yISO ? streak + 1 : 1;
  }

  lastCompletedDate = today;
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastCompletedDate", today);
}

// RENDER
function renderTasks() {
  todayList.innerHTML = "";
  olderList.innerHTML = "";
  
function renderStreak() {
  const el = document.getElementById("streakText");
  el.textContent = streak > 0 ? `🔥 ${streak} day streak` : "";
}

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

function updateMotivation() {
  const motivation = document.getElementById("motivationText");

  if (tasks.length === 0) {
    motivation.textContent = "Add your first task and start your day!";
  } else if (tasks.every((t) => t.completed)) {
    motivation.textContent = "All tasks done — good job! ";
  } else {
    motivation.textContent = "";
  }
  function updateStats() {
  const stats = document.getElementById("statsText");

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;

  if (total === 0) {
    stats.textContent = "";
  } else {
    stats.textContent = `✅ ${done} completed • 📝 ${total} total`;
  }
}
  document.getElementById("archiveBtn").addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
updateMotivation();
updateStats();
updateStreak();
renderStreak();



