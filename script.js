let draggedTaskId = null;
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- HELPERS ---------- */
  const todayISO = () => new Date().toISOString().split("T")[0];

  /* ---------- ELEMENTS ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const todayList = document.getElementById("todayList");
  const olderList = document.getElementById("olderList");
  const progressText = document.getElementById("progressText");
  const motivationText = document.getElementById("motivationText");
  const streakText = document.getElementById("streakText");
  const archiveBtn = document.getElementById("archiveBtn");
  const addBtn = document.getElementById("addBtn");
  const input = document.getElementById("newTask");

  /* ---------- THEME ---------- */
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

  /* ---------- DATE ---------- */
  const today = new Date();
  document.getElementById("dayName").textContent =
    today.toLocaleDateString("en-US", { weekday: "long" });
  document.getElementById("dayNumber").textContent = today.getDate();
  document.getElementById("monthName").textContent =
    today.toLocaleDateString("en-US", { month: "long" });

  /* ---------- STORAGE ---------- */
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let streak = Number(localStorage.getItem("streak")) || 0;
  let lastCompletedDate = localStorage.getItem("lastCompletedDate");

  const saveTasks = () =>
    localStorage.setItem("tasks", JSON.stringify(tasks));

  /* ---------- ADD TASK ---------- */
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!input.value.trim()) return;

    tasks.push({
      id: Date.now(),
      text: input.value.trim(),
      completed: false,
      date: todayISO(),
    });

    input.value = "";
    saveTasks();
    render();
  });

  /* ---------- STREAK ---------- */
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
    streakText.textContent = streak ? `🔥 ${streak} day streak` : "";
  }

  /* ---------- MOTIVATION ---------- */
  function updateMotivation() {
    if (tasks.length === 0) {
      motivationText.textContent = "Start your day by adding a task ✨";
    } else if (tasks.every((t) => t.completed)) {
      motivationText.textContent = "All tasks completed — great job! 🎉";
    } else {
      motivationText.textContent = "";
    }
  }

  /* ---------- RENDER ---------- */
  function render() {
    todayList.innerHTML = "";
    olderList.innerHTML = "";

    let done = 0;
    const todayStr = todayISO();

    tasks.forEach((task) => {
      const el = document.createElement("div");
      el.className = "task";
      if (task.completed) {
        el.classList.add("completed");
        done++;
      }
el.draggable = true;

/* DRAG START */
el.addEventListener("dragstart", () => {
  draggedTaskId = task.id;
  el.classList.add("dragging");
});

/* DRAG END */
el.addEventListener("dragend", () => {
  el.classList.remove("dragging");
  draggedTaskId = null;
});

      el.innerHTML = `
        <span class="taskText">${task.text}</span>
        <div>
          <button class="editBtn">✎</button>
          <button class="deleteBtn">✕</button>
        </div>
      `;

      /* toggle completed */
      el.querySelector(".taskText").addEventListener("click", () => {
        task.completed = !task.completed;
        saveTasks();
        updateStreak();
        render();
      });

     /* EDIT – INLINE */
el.querySelector(".editBtn").addEventListener("click", (e) => {
  e.stopPropagation();

  const textEl = el.querySelector(".taskText");

  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.className = "editInput";

  textEl.replaceWith(input);
  input.focus();

  const saveEdit = () => {
    const value = input.value.trim();
    if (value) {
      task.text = value;
      saveTasks();
    }
    render();
  };

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") render();
  });
});


      /* DELETE */
      el.querySelector(".deleteBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        render();
      });

      (task.date === todayStr ? todayList : olderList).appendChild(el);
    });

    progressText.textContent = `${done} / ${tasks.length}`;
    updateMotivation();
    renderStreak();
  }

  /* ---------- ARCHIVE ---------- */
  archiveBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    render();
  });
  /* ---------- DRAG & DROP ZONES ---------- */
  [todayList, olderList].forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    list.addEventListener("drop", () => {
      if (!draggedTaskId) return;

      const task = tasks.find((t) => t.id === draggedTaskId);
      if (!task) return;

      if (list === todayList) {
        task.date = todayISO();
      } else {
        task.date = "older";
      }

      saveTasks();
      render();
    });
  });

  render();
});

  
