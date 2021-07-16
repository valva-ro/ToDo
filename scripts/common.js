function alertar(msj) {
    const alerta = document.querySelector(".alert");
    alerta.classList.remove("hide");
    alerta.querySelector(".texto").innerText = msj;
    alerta.querySelector(".closebtn").onclick = () => {
        alerta.classList.add("hide");
    };
}