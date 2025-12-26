// SHRANJEVANJE TASKOV
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//DATUM
const today = new Date();
const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
const dayNumber = today.getDate();
const monthName = today.toLocaleDateString("en-US", { month: "long" });

document.getElementById("dayName").textContent = dayName;
document.getElementById("dayNumber").textContent = dayNumber;
document.getElementById("monthName").textContent = monthName;

// ELEMENTI
const addBtn = document.getElementById("addBtn");
const newTask = document.getElementById("newTask");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");

// DODAJ TASK
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

// 🎨 IZRIS TASKOV
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

    // toggle completed
    taskEl.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // delete
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

// NALOŽI OB ZAGONU
renderTasks();

//  SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((err) => console.log("SW registration failed", err));
}
