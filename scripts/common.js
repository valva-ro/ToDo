function alertar(msg) {
    const alerta = document.querySelector(".alert");
    alerta.classList.remove("hide");
    alerta.querySelector(".text").innerText = msg;
    alerta.querySelector(".closebtn").onclick = () => {
        alerta.classList.add("hide");
    };
}

function showSpinner() {
    const spinnerContainer = document.createElement("div");
    const spinner = document.createElement("div");

    spinnerContainer.setAttribute("id", "container-loading-screen");
    spinnerContainer.classList.add("container-loading-screen");
    spinner.setAttribute("id", "carga");
    spinner.classList.add("loader");
    spinnerContainer.appendChild(spinner);

    document.querySelector("body").appendChild(spinnerContainer);
    document.querySelector("main").classList.add("display-none");

}

function hideSpinner() {
    const spinnerContainer = document.querySelector("#container-loading-screen");
    document.querySelector("body").removeChild(spinnerContainer);
    document.querySelector("main").classList.remove("display-none");
}
