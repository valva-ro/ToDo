const requestManager = new RequestManager('https://ctd-todo-api.herokuapp.com/v1');
let datosUsuario = null;

window.onload = () => {
    const formLogin = document.forms.formLogin;
    const nombre = formLogin.nombre;
    const apellido = formLogin.apellido;
    const contrasenia = formLogin.contrasenia;
    const repetirContrasenia = formLogin.repetirContrasenia;
    const mail = formLogin.mail;
    let rutaImagen = "./assets/user.png";

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validarDatos(nombre.value, apellido.value, contrasenia.value, repetirContrasenia.value, mail.value)) {
            datosUsuario = new DatosUsuario(nombre.value, apellido.value, contrasenia.value, mail.value);
            requestManager.crearUsuario(datosUsuario, rutaImagen);
        }
    });

    formLogin.querySelector("#inputAgregarImagen").addEventListener("change", event => {
        const imagen = event.target.files[0];
        const imagenHtml = document.querySelector("img");
        const reader = new FileReader();
        reader.onload = event => {
            rutaImagen = event.target.result;
            imagenHtml.src = rutaImagen;
            imagenHtml.className += "seleccionada";
        }
        reader.readAsDataURL(imagen);
    });
}

function validarEsStringLetras(string) {
    return /\D/.test(string);
}

function validarContrasenia(contrasenia, repetirContrasenia) {
    const sonIguales = contrasenia == repetirContrasenia;
    const longitudCorrecta = contrasenia.length > 7;
    return sonIguales && longitudCorrecta;
}

function validarEmail(mail) {
    const regex = /\w+@[A-z]+.[A-z]{2,3}(.[a-z]{2,3})?/
    return regex.test(mail);
}

function validarDatos(nombre, apellido, contrasenia, repetirContrasenia, mail) {
    const nombreValido = validarEsStringLetras(nombre);
    const apellidoValido = validarEsStringLetras(apellido);
    const contraseniaValida = validarContrasenia(contrasenia, repetirContrasenia);
    const mailValido = validarEmail(mail);
    return nombreValido && apellidoValido && contraseniaValida && mailValido;
}