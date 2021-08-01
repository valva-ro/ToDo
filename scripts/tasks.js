checkToken();
setInterval(checkToken, 60000);

window.onload = () => {

  const form = document.forms.formNewTask;

  loadPage();

  form.onsubmit = event => {
    event.preventDefault();
    addTask();
    form.newTask.value = "";
  };
  
  form.ordenar.onclick = event => {
    event.preventDefault();
    sortByDate();
  };

  document.querySelector("#closeSession").addEventListener("click", () => {
    closeSession();
  });
}

function loadPage() {
  loadUserName();
  createTasks();
}

function loadUserName() {
  const username = document.querySelector('#user-name');
  RequestManager.get('/users/getMe')
    .then(user => {
      username.innerHTML = `Tareas de <b>${user.firstName}</b>`;
    })
}

function createTasks() {
  document.querySelector(".todo-tasks").innerHTML = "";
  document.querySelector(".done-tasks").innerHTML = "";
  RequestManager.get("/tasks")
    .then(tasks => {
      tasks.sort((a, b) => {
        return a.createdAt < b.createdAt ? -1 : 1;
      }).forEach(task => {
        renderizeTask(task);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function renderizeTask(task) {
  const fecha = getParsedDate(task.createdAt);
  const contenedor = task.completed ? ".done-tasks" : ".todo-tasks";
  const contenedorTareas = document.querySelector(contenedor);
  const template = `
    <li class="task" id=task${task.id}>
      <div class="not-done" onclick="changeContainer(${task.id}, ${task.completed})"></div>
      <div class="description">
        <p class="name">${task.description}</p>
        <div>
          <p class="timestamp" id="${task.createdAt}">Creada el: ${fecha}</p>
          <button class="delete" onclick="deleteTask(${task.id})">
            <img src="./assets/trash-bin.png">
          </button>
        </div>
      </div>
    </li>
  `;
  contenedorTareas.innerHTML += template;
}

function addTask() {
  const description = document.forms.formNewTask.newTask.value
  if (description !== "") {
    RequestManager.post("/tasks", { description })
      .then(task => {
        renderizeTask(task);
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    alertar("No se puede crear una tarea sin descripción");
  }
}

function getParsedDate(f) {
  const date = new Date(f);
  let day = date.getDate()
  let month = parseInt(date.getMonth()) + 1;
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  return day + "/" + month + "/" + date.getFullYear();
}

function sortByDate() {
  const toDoTasks = document.querySelector(".todo-tasks");
  const tasks = toDoTasks.querySelectorAll("li");
  Array.from(tasks).sort((a, b) => {
    const fechaA = a.querySelector(".timestamp");
    const fechaB = b.querySelector(".timestamp");
    const timestampA = new Date(fechaA.id);
    const timestampB = new Date(fechaB.id);
    return timestampA < timestampB ? -1 : 1;
  }).forEach(nodo => {
    toDoTasks.appendChild(nodo);
  });
}

function checkToken() {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined") {
    location.href = "./login.html"
  }
}

function changeContainer(id, isDone) {
  const task = document.querySelector(`#task${id}`);
  const container = isDone ? ".todo-tasks" : ".done-tasks";
  document.querySelector(container).appendChild(task);
  task.querySelector(".not-done").addEventListener("click", () => {
    changeContainer(id, !isDone)
  });
  RequestManager.put(`/tasks/${id}`, { completed: !isDone });
}

function deleteTask(id) {
  const elementoTarea = document.querySelector(`#task${id}`)
  Swal.fire({
    title: '¿Deseas eliminar esta tarea?',
    text: "Esta acción no puede revertirse",
    icon: 'question',
    showCancelButton: true,
    cancelButtonColor: 'var(--secondary)',
    confirmButtonColor: 'var(--primary)',
    cancelButtonText: 'No',
    confirmButtonText: 'Sí',
  }).then((result) => {
    if (result.isConfirmed) {
      elementoTarea.parentNode.removeChild(elementoTarea);
      RequestManager.delete(`/tasks/${id}`).then(() => {
        Swal.fire(
          '¡Listo!',
          'La task fue borrada con éxito.',
          'success'
        )
      }).catch(err => {
        console.log(err);
      })
    }
  })
}

function closeSession() {
  localStorage.removeItem("token");
  location.reload();
}