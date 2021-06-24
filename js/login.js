window.onload = () => {

    document.querySelector("#login").onclick = event => {
        event.preventDefault();
        login();
    };
}

function login() {
    const mail = document.querySelector("#mail").value;
    const password = document.querySelector("#password").value;
    const usuarios = localStorage.getItem("usuarios");

}