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
