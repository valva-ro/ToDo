let userData = null;

window.onload = () => {
    const formLogin = document.forms.formLogin;
    const firstName = formLogin.firstName;
    const lastName = formLogin.lastName;
    const pswd = formLogin.password;
    const repeatedPswd = formLogin.repeatedPassword;
    const email = formLogin.mail;

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateData(firstName.value, lastName.value, pswd.value, repeatedPswd.value, email.value)) {
            userData = new UserData(firstName.value, lastName.value, pswd.value, email.value);
            RequestManager.post("/users", userData)
                .then(datos => {
                    if (datos.jwt !== null) {
                        this.token = datos.jwt;
                        localStorage.setItem('token', this.token);
                        location.href = './tasks.html';
                    }
                })
                .catch(err => {
                    console.error(err);
                    hideSpinner();
                });
        } else {
            alertar("Alguno de los datos ingresados no es válido");
        }
    });
}

function validateStringOnlyLetters(string) {
    return /\D/.test(string);
}

function validatePassword(pswd, repeatedPswd) {
    const equals = pswd == repeatedPswd;
    const lengthGreaterThan7 = contrasenia.length > 7;
    return equals && lengthGreaterThan7;
}

function validateEmail(email) {
    const regex = /\w+@[A-z]+.[A-z]{2,3}(.[a-z]{2,3})?/
    return regex.test(email);
}

function validateData(firstName, lastName, pswd, repeatedPswd, email) {
    const firstNameValid = validateStringOnlyLetters(firstName);
    const lastNameValid = validateStringOnlyLetters(lastName);
    const pswdValid = validatePassword(pswd, repeatedPswd);
    const emailValid = validateEmail(email);
    return firstNameValid && lastNameValid && pswdValid && emailValid;
}