let contadorTareas = 1;
let tareas = [];

window.onload = function () {

    cargarContenido(crearTareas, agregarEventListeners);

    document.querySelector("#agregarTarea").addEventListener("click", event => {
        event.preventDefault();
        agregarTarea();
    });

    document.querySelector("#ordenar").addEventListener("click", event => {
        event.preventDefault();
        ordenarPorFecha();
    });
};

function cargarContenido(crearTareas, agregarEventListeners) {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (usuario) {
        document.querySelector("#username").innerText = usuario.nombre;
        document.querySelector(".user-image").src = usuario.imagen;
    }
    crearTareas(agregarEventListeners);
}

function crearTareas(cb) {
    if (localStorage.getItem("tareas")) {
        tareas = JSON.parse(localStorage.getItem("tareas"));
        tareas.forEach(t => renderizarTarea(t));
        cb();
    }
}

function renderizarTarea(t) {
    const tarea = `
        <li class="tarea" id="tarea-${contadorTareas}">
            <div class="not-done"></div>
            <div class="descripcion">
                <p class="nombre">${t.nombre}</p>
                <p class="timestamp">Creada: <span>${t.fecha}</span></p>
            </div>
        </li>
    `;
    document.querySelector(".tareas-pendientes").innerHTML += tarea;
    contadorTareas++;
}

function agregarEventListeners() {
    const btnTareasPendientes = document.querySelectorAll(".tareas-pendientes .not-done");
    btnTareasPendientes.forEach(btn => {
        btn.onclick = function (event) {
            event.preventDefault();
            marcarTareaTerminada(event.target.parentNode);
        };
    });

    const btnTareasHechas = document.querySelectorAll(".tareas-terminadas .not-done");
    btnTareasHechas.forEach(btn => {
        btn.onclick = function (event) {
            event.preventDefault();
            desmarcarTareaTerminada(event.target.parentNode);
        };
    });
}

function agregarTarea() {
    const nuevaTarea = { nombre: "", fecha: "", estado: false };
    nuevaTarea.nombre = document.querySelector("#nuevaTarea").value;
    nuevaTarea.fecha = obtenerFechaDeHoyFormateada();
    if (nuevaTarea.nombre) {
        renderizarTarea(nuevaTarea);
        agregarEventListeners();
        actualizarTareasLocalStorage(nuevaTarea);
    } else {
        alertar("No se puede crear una tarea sin nombre");
    }
}

function actualizarTareasLocalStorage(tarea) {
    tareas.push(tarea);
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function ordenarPorFecha() {
    const tareas = document.querySelectorAll(".tareas-pendientes li");
    Array.from(tareas).sort((a, b) => {
        a = a.querySelector(".timestamp span").innerText;
        b = b.querySelector(".timestamp span").innerText;
        return obtenerFecha(a).getTime() < obtenerFecha(b).getTime() ? -1 : 1;
    }).forEach(nodo => {
        nodo.parentNode.appendChild(nodo);
    });
}

function obtenerFechaDeHoyFormateada() {
    const fecha = new Date();
    let dia = fecha.getDate() 
    let mes = parseInt(fecha.getMonth()) + 1; 
    dia = dia < 10 ? "0" + dia : dia;
    mes = mes < 10 ? "0" + mes : mes;
    return dia + "/" + mes + "/" + fecha.getFullYear();
}

function obtenerFecha(strFecha) {
    return new Date(strFecha.split("/")[2], strFecha.split("/")[1] - 1, strFecha.split("/")[0])
}


function marcarTareaTerminada(tarea) {
    tarea.querySelector(".not-done").onclick = () => desmarcarTareaTerminada(tarea);
    document.querySelector(".tareas-terminadas").appendChild(tarea);
}

function desmarcarTareaTerminada(tarea) {
    tarea.querySelector(".not-done").onclick = () => marcarTareaTerminada(tarea);
    document.querySelector(".tareas-pendientes").appendChild(tarea);
}