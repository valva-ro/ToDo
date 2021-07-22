function alertar(msj) {
    const alerta = document.querySelector(".alert");
    alerta.classList.remove("hide");
    alerta.querySelector(".texto").innerText = msj;
    alerta.querySelector(".closebtn").onclick = () => {
        alerta.classList.add("hide");
    };
}

function mostrarSpinner() {
    const spinnerContainer = document.createElement("div");
    const spinner = document.createElement("div");

    spinnerContainer.setAttribute("id", "contenedor-loading-screen");
    spinnerContainer.classList.add("contenedor-loading-screen");
    spinner.setAttribute("id", "carga");
    spinner.classList.add("loader");
    spinnerContainer.appendChild(spinner);

    document.querySelector("body").appendChild(spinnerContainer);
    document.querySelector("main").classList.add("display-none");

}

function ocultarSpinner() {
    const spinnerContainer = document.querySelector("#contenedor-loading-screen");
    document.querySelector("body").removeChild(spinnerContainer);
    document.querySelector("main").classList.remove("display-none");
}
