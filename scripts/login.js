window.onload = () => {

    const formLogin = document.forms.formLogin;

    formLogin.onsubmit = e => {
        e.preventDefault();
        const body = {
            email: formLogin.mail.value,
            password: formLogin.contrasenia.value
        }
        showSpinner();
        RequestManager.post("/users/login", body)
            .then(datos => {
                if (datos.jwt !== undefined) {
                    this.token = datos.jwt;
                    localStorage.setItem('token', this.token);
                    location.href = './tasks.html';
                }
            })
            .catch(err => {
                console.error(err);
                hideSpinner();
            });
    };
};