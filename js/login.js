window.onload = () => {
    document.querySelector("#login").onclick = event => {
        event.preventDefault();
        login();
    };
}

function login() {
    const mail = document.querySelector("#mail").value;
    const password = document.querySelector("#password").value;
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const usuario = usuarios.find(usuario => {
        return usuario.mail === mail && usuario.password === password
    });
    if (usuario !== undefined) {
        sessionStorage.setItem("usuario", usuario);
        window.open("./lista-tareas.html", "_self");
    } else {
        alertar("Mail y/o contraseña incorrectos");
    }
}