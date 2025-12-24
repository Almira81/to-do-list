// 🗓️ Datum
const today = new Date();
const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
const dayNumber = today.getDate();
const monthName = today.toLocaleDateString("en-US", { month: "long" });

document.getElementById("dayName").textContent = dayName;
document.getElementById("dayNumber").textContent = dayNumber;
document.getElementById("monthName").textContent = monthName;

// ✅ Naloge
const addBtn = document.getElementById("addBtn");
const newTask = document.getElementById("newTask");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");

let totalTasks = 0;
let doneTasks = 0;

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const taskText = newTask.value.trim();
  if (taskText !== "") {
    const task = document.createElement("div");
    task.className = "task";
    task.innerHTML = `
      <span>${taskText}</span>
      <button class="deleteBtn">✕</button>
    `;
    taskList.appendChild(task);
    newTask.value = "";
    totalTasks++;
    updateProgress();

    task.addEventListener("click", () => {
      task.classList.toggle("completed");
      task.classList.contains("completed") ? doneTasks++ : doneTasks--;
      updateProgress();
    });

    task.querySelector(".deleteBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (task.classList.contains("completed")) doneTasks--;
      task.remove();
      totalTasks--;
      updateProgress();
    });
  }
});

function updateProgress() {
  progressText.textContent = `${doneTasks} / ${totalTasks} tasks done`;
}
// 📱 Registracija Service Workerja
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((err) => console.log("SW registration failed", err));
}
