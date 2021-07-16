const requestManager = new RequestManager('https://ctd-todo-api.herokuapp.com/v1');

window.onload = () => {

    const formLogin = document.forms.formLogin;

    formLogin.onsubmit = e => {
        e.preventDefault();
        const email = formLogin.mail.value;
        const password = formLogin.contrasenia.value;
        requestManager.iniciarSesion(email, password);
    };
};