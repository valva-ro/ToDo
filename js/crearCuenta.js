// TODO: encriptar y desencriptar contrasenia para almacenamiento
let usuario = {
    nombre: null,
    password: null,
    mail: null,
    imagen: null,
}

let usuarios = JSON.parse(localStorage.getItem("usuarios"));

window.onload = () => {

    document.querySelector("#crearCuenta").onclick = event => {
        event.preventDefault();
        crearCuenta();
        agregarUsuario();
    };

    document.querySelector("#inputAgregarImagen").onchange = event => {
        const imagen = event.target.files[0];
        const imagenHtml = document.querySelector("img");
        const reader = new FileReader();
        reader.onload = event => {
            const img = event.target.result
            usuario.imagen = img;
            imagenHtml.src = img;
            imagenHtml.className += "seleccionada";
        }
        reader.readAsDataURL(imagen);
    };
};

function obtenerDatosUsuario() {
    usuario.nombre = document.querySelector("#nombre").value;
    usuario.password = document.querySelector("#password").value;
    usuario.mail = document.querySelector("#mail").value;
}

function validarNombre(nombre) {
    const regex = /^[A-Za-z]+$/;
    const esValido = nombre.match(regex);
    if (!esValido) {
        alertar("El nombre no es válido");
    }
    return esValido;
}

function validarMail(mail) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const esValido = mail.match(regex);
    if (!esValido) {
        alertar("El mail no es válido");
    }
    return esValido;
}

function validarPassword(password) {
    const passwordRepetida = document.querySelector("#passwordRepetida").value;
    let esValido = false;
    if (password !== passwordRepetida) {
        alertar("Las contraseñas ingresadas no coinciden");
    } else {
        const regex = /^[a-zA-Z0-9]*$/;
        esValido = password.match(regex);
        if (!esValido) {
            alertar("La contraseña no es válida");
        }
    }
    return esValido;
}

function usuarioExistente(mail) {
    let existeUsuario = false;
    const usuario = usuarios.find(usuario => usuario.mail === mail);
    console.log(usuario);
    if (usuario !== undefined) {
        alertar("Ya existe un usuario con ese mail");
        existeUsuario = true;
    }
    return existeUsuario;
}

function validarDatos() {
    let sonValidos = validarNombre(usuario.nombre) && 
                     validarPassword(usuario.password) &&
                     validarMail(usuario.mail) &&
                     !usuarioExistente(usuario.mail);
    usuario.imagen = (usuario.imagen === null ? "./../assets/user.png" : usuario.imagen);
    return sonValidos;
}

function crearCuenta() {
    obtenerDatosUsuario();
    if (validarDatos()) {
        window.open("./html/lista-tareas.html", "_self");
    }
}

function agregarUsuario() {
    if (usuarios === null || usuarios.length === 0) {
        usuarios = [];
    }
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    sessionStorage.setItem("usuario", JSON.stringify(usuario));
}