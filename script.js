// =====================
// HELPERS
// =====================
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// =====================
// THEME
// =====================
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

// =====================
// STORAGE
// =====================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =====================
// ELEMENTS
// =====================
const todayList = document.getElementById("todayList");
const olderList = document.getElementById("olderList");
const progressText = document.getElementById("progressText");
const motivationText = document.getElementById("motivationText");
const statsText = document.getElementById("statsText");
const streakText = document.getElementById("streakText");

// =====================
// DATE HEADER
// =====================
const today = new Date();
document.getElementById("dayName").textContent =
  today.toLocaleDateString("en-US", { weekday: "long" });
document.getElementById("dayNumber").textContent = today.getDate();
document.getElementById("monthName").textContent =
  today.toLocaleDateString("en-US", { month: "long" });

// =====================
// ADD TASK
// =====================
document.getElementById("addBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("newTask");
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    date: todayISO(),
  });

  input.value = "";
  saveTasks();
  renderTasks();
});

// =====================
// MOTIVATION
// =====================
function updateMotivation() {
  if (tasks.length === 0) {
    motivationText.textContent = "✨ Add your first task and start your day ✨";
  } else if (tasks.every((t) => t.completed)) {
    motivationText.textContent = "🎉 All tasks done — great job! 🎉";
  } else {
    motivationText.textContent = "";
  }
}

// =====================
// STATS
// =====================
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;

  statsText.textContent =
    total === 0 ? "" : `✅ ${done} completed • 📝 ${total} total`;
}

// =====================
// STREAK
// =====================
let streak = Number(localStorage.getItem("streak")) || 0;
let lastCompletedDate = localStorage.getItem("lastCompletedDate");

function updateStreak() {
  const today = todayISO();
  const completedToday = tasks.some(
    (t) => t.completed && t.date === today
  );

  if (!completedToday || lastCompletedDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yISO = yesterday.toISOString().split("T")[0];

  streak = lastCompletedDate === yISO ? streak + 1 : 1;
  lastCompletedDate = today;

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastCompletedDate", today);
}

function renderStreak() {
  streakText.textContent = streak > 0 ? `🔥 ${streak} day streak` : "";
}

// =====================
// ARCHIVE COMPLETED
// =====================
document.getElementById("archiveBtn").addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
});

// =====================
// RENDER TASKS
// =====================
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

    task.date === todayStr
      ? todayList.appendChild(taskEl)
      : olderList.appendChild(taskEl);
  });

  progressText.textContent = `${done} / ${tasks.length} tasks done`;

  updateMotivation();
  updateStats();
  updateStreak();
  renderStreak();
}

// =====================
// INIT
// =====================
renderTasks();
