const requestManager = new RequestManager('https://ctd-todo-api.herokuapp.com/v1');
comprobarToken();
setInterval(comprobarToken, 60000);
window.onload = () => {

  const form = document.forms.formNuevaTarea;
  const ordenar = form.ordenar;
  const img = localStorage.getItem(localStorage.getItem("currentUser"));
  const rutaImagen = img !== null ? img : "./assets/user.png";
  document.querySelector("div.user-image").innerHTML = `<img src="${rutaImagen}" alt="Imagen de usuario">`

  document.querySelector("#cerrarSesion").addEventListener("click", () => {
    cerrarSesion();
  });

  requestManager.crearTareas();

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

function renderizarTarea(tarea) {
  const fecha = formatearFecha(tarea.createdAt)
  const contenedor = tarea.completed ? ".tareas-terminadas" : ".tareas-pendientes";
  const contenedorTareas = document.querySelector(contenedor);
  const template = `
    <li class="tarea" id=tarea${tarea.id}>
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
    requestManager.agregarTarea(descripcion);
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
  document.querySelector(contenedor).appendChild(tarea);
  tarea.querySelector(".not-done").addEventListener("click", () => {
    cambiarTareaDeContenedor(id, !marcarTerminada)
  });
  requestManager.actualizarTarea(id, !marcarTerminada);
}

function eliminarTarea(elementoTarea, id) {
  elementoTarea.parentNode.removeChild(elementoTarea);
  requestManager.eliminarTarea(id);
}

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  location.reload();
}