let datosUsuario = null;

window.onload = () => {
    const formLogin = document.forms.formLogin;
    const nombre = formLogin.nombre;
    const apellido = formLogin.apellido;
    const contrasenia = formLogin.contrasenia;
    const repetirContrasenia = formLogin.repetirContrasenia;
    const mail = formLogin.mail;

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validarDatos(nombre.value, apellido.value, contrasenia.value, repetirContrasenia.value, mail.value)) {
            datosUsuario = new DatosUsuario(nombre.value, apellido.value, contrasenia.value, mail.value);
            RequestManager.post("/users", datosUsuario)
                .then(datos => {
                    if (datos.jwt !== null) {
                        this.token = datos.jwt;
                        localStorage.setItem('token', this.token);
                        location.href = './lista-tareas.html';
                        ocultarSpinner();
                    }
                })
                .catch(err => {
                    console.error(err);
                    ocultarSpinner();
                });
        } else {
            alertar("Alguno de los datos ingresados no es válido");
        }
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