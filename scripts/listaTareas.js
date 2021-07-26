comprobarToken();
setInterval(comprobarToken, 60000);

window.onload = () => {

  const form = document.forms.formNuevaTarea;
  const ordenar = form.ordenar;

  crearTareas();

  document.querySelector("#cerrarSesion").addEventListener("click", () => {
    cerrarSesion();
  });

  form.onsubmit = event => {
    event.preventDefault();
    agregarTarea();
    form.nuevaTarea.value = "";
  };
  
  ordenar.onclick = event => {
    event.preventDefault();
    ordenarPorID();
  };
}

function crearTareas() {
  document.querySelector(".tareas-pendientes").innerHTML = "";
  document.querySelector(".tareas-terminadas").innerHTML = "";
  RequestManager.get("/tasks")
    .then(tareas => {
      tareas.forEach(tarea => {
        crearTarea(tarea);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function crearTarea(tarea) {
  const promesa = new Promise((resolve, reject) => {
    resolve(renderizarTarea(tarea));
  });
  promesa.then(() => {
    agregarEventListener(tarea);
  })
}

function renderizarTarea(tarea) {
  const fecha = formatearFecha(tarea.createdAt)
  const contenedor = tarea.completed ? ".tareas-terminadas" : ".tareas-pendientes";
  const contenedorTareas = document.querySelector(contenedor);
  const template = `
    <li class="tarea animar-entrada" id=tarea${tarea.id}>
      <div class="not-done"></div>
      <div class="descripcion">
        <p class="nombre">${tarea.description}</p>
        <div>
          <p class="timestamp">Creada el: ${fecha}</p>
          <button class="eliminar">
            <img src="./assets/trash-bin.png">
          </button>
        </div>
      </div>
    </li>
  `;
  contenedorTareas.innerHTML += template;
}

function formatearFecha(f) {
  const fecha = new Date(f);
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();
  dia = dia < 10 ? "0" + dia : dia;
  mes = mes < 10 ? "0" + mes : mes;
  return `${dia}/${mes}/${anio}`
}

function agregarTarea() {
  const descripcion = document.forms.formNuevaTarea.nuevaTarea.value
  if (descripcion !== "") {
    const body = {
      "description": description,
      "completed": false
    }
    RequestManager.post("/tasks", body)
      .then(tarea => {
        crearTarea(tarea);
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    alertar("No se puede crear una tarea sin nombre");
  }
}

function obtenerFechaFormateada(f) {
  const fecha = new Date(f);
  let dia = fecha.getDate()
  let mes = parseInt(fecha.getMonth()) + 1;
  dia = dia < 10 ? "0" + dia : dia;
  mes = mes < 10 ? "0" + mes : mes;
  return dia + "/" + mes + "/" + fecha.getFullYear();
}

function ordenarPorID() {
  const tareasPendientes = document.querySelector(".tareas-pendientes");
  const tareas = tareasPendientes.querySelectorAll("li");
  Array.from(tareas).sort((a, b) => {
    const idA = a.id
    const idB = b.id
    idA.replace("tarea", "");
    idB.replace("tarea", "");
    return idA < idB ? -1 : 1;
  }).forEach(nodo => {
    tareasPendientes.appendChild(nodo);
  });
}

function comprobarToken() {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined") {
    location.href = "./login.html"
  }
}

function agregarEventListener(tarea) {
  const elementoTarea = document.querySelector(`#tarea${tarea.id}`);
  const btnTerminar = elementoTarea.querySelector(".not-done");
  const btnEliminar = elementoTarea.querySelector("button.eliminar");
  btnTerminar.onclick = function () {
    cambiarTareaDeContenedor(tarea.id, tarea.completed);
  };
  btnEliminar.onclick = function () {
    eliminarTarea(elementoTarea, tarea.id);
  };
}

function cambiarTareaDeContenedor(id, marcarTerminada) {
  const tarea = document.querySelector(`#tarea${id}`);
  const contenedor = marcarTerminada ? ".tareas-pendientes" : ".tareas-terminadas";
  const body = {
    completed: !marcarTerminada
  }
  document.querySelector(contenedor).appendChild(tarea);
  tarea.querySelector(".not-done").addEventListener("click", () => {
    cambiarTareaDeContenedor(id, !marcarTerminada)
  });
  RequestManager.put(`/tasks/${id}`, body);
}

function eliminarTarea(elementoTarea, id) {
  elementoTarea.parentNode.removeChild(elementoTarea);
  RequestManager.delete(`/tasks/${id}`);
}

function cerrarSesion() {
  localStorage.removeItem("token");
  location.reload();
}