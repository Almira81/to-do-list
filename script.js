document.addEventListener("DOMContentLoaded", () => {

  const todayISO = () => new Date().toISOString().split("T")[0];

  // ELEMENTI
  const themeToggle = document.getElementById("themeToggle");
  const todayList = document.getElementById("todayList");
  const olderList = document.getElementById("olderList");
  const progressText = document.getElementById("progressText");
  const motivationText = document.getElementById("motivationText");
  const streakText = document.getElementById("streakText");
  const archiveBtn = document.getElementById("archiveBtn");

  // THEME
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

  // DATE
  const today = new Date();
  document.getElementById("dayName").textContent =
    today.toLocaleDateString("en-US", { weekday: "long" });
  document.getElementById("dayNumber").textContent = today.getDate();
  document.getElementById("monthName").textContent =
    today.toLocaleDateString("en-US", { month: "long" });

  // STORAGE
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let streak = Number(localStorage.getItem("streak")) || 0;
  let lastCompletedDate = localStorage.getItem("lastCompletedDate");

  const saveTasks = () =>
    localStorage.setItem("tasks", JSON.stringify(tasks));

  // ADD TASK
  document.getElementById("addBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const input = document.getElementById("newTask");
    if (!input.value.trim()) return;

    tasks.push({
      id: Date.now(),
      text: input.value.trim(),
      completed: false,
      date: todayISO()
    });

    input.value = "";
    saveTasks();
    render();
  });

  // RENDER
  function render() {
    todayList.innerHTML = "";
    olderList.innerHTML = "";

    let done = 0;
    const todayStr = todayISO();

    tasks.forEach(task => {
      const el = document.createElement("div");
      el.className = "task";
      if (task.completed) {
        el.classList.add("completed");
        done++;
      }
el.innerHTML = `
  <span class="taskText">${task.text}</span>
  <button>✕</button>
`;
      const textEl = el.querySelector(".taskText");

textEl.addEventListener("dblclick", (e) => {
  e.stopPropagation();

  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.className = "editInput";

  textEl.replaceWith(input);
  input.focus();

  const saveEdit = () => {
    if (input.value.trim()) {
      task.text = input.value.trim();
      saveTasks();
    }
    render();
  };

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
  });
});
// TOGGLE COMPLETED (single click)
textEl.addEventListener("click", (e) => {
  e.stopPropagation();
  task.completed = !task.completed;
  saveTasks();
  updateStreak();
  render();
});

      el.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        render();
      });

      (task.date === todayStr ? todayList : olderList).appendChild(el);
    });

    progressText.textContent = `${done} / ${tasks.length}`;
    updateMotivation();
    renderStreak();
  }

  function updateMotivation() {
    if (tasks.length === 0) {
      motivationText.textContent = "Add your first task ✨";
    } else if (tasks.every(t => t.completed)) {
      motivationText.textContent = "All tasks done!";
    } else {
      motivationText.textContent = "";
    }
  }

  function updateStreak() {
    const today = todayISO();
    if (!tasks.some(t => t.completed && t.date === today)) return;
    if (lastCompletedDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yISO = yesterday.toISOString().split("T")[0];

    streak = lastCompletedDate === yISO ? streak + 1 : 1;
    lastCompletedDate = today;

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastCompletedDate", today);
  }

  function renderStreak() {
    streakText.textContent = streak ? `🔥 ${streak} day streak` : "";
  }

  archiveBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
  });

  render();
});


