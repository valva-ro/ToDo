class RequestManager {
    constructor(url) {
        this.url = url;
        this.token = localStorage.getItem("token");
        if (typeof RequestManager.instance === "object") {
            return RequestManager.instance;
        } else {
            RequestManager.instance = this;
            return this;
        }
    }

    defaultSettings() {
        return  { 
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    crearUsuario(datosUsuario, rutaImagen) {
        let settings = this.defaultSettings();
        settings.method = "POST";
        settings.body = JSON.stringify(datosUsuario);
        fetch(`${this.url}/users`, settings)
            .then(respuesta => {
                return respuesta.json();
            })
            .then(datos => {
                if (datos.jwt !== null) {
                    this.token = datos.jwt;
                    localStorage.setItem('token', this.token);
                    localStorage.setItem("currentUser", datosUsuario.email);
                    localStorage.setItem(datosUsuario.email, rutaImagen);
                    location.href = './lista-tareas.html';
                }
            })
            .catch(err => {
                alertar(err);
            });
    }

    iniciarSesion(email, password) {
        let settings = this.defaultSettings();
        settings.method = "POST";
        settings.body = JSON.stringify({ email, password, });
        fetch(`${this.url}/users/login`, settings)
            .then(respuesta => {
                return respuesta.json();
            })
            .then(datos => {
                let rutaImagen = localStorage.getItem(this.token);
                if (datos.jwt !== undefined) {
                    this.token = datos.jwt;
                    localStorage.setItem('token', this.token);
                    location.href = './lista-tareas.html';
                    document.querySelector("div.user-image").innerHTML = `<img src="${rutaImagen}" alt="Imagen de usuario">`
                }
            })
            .catch(err => {
                alertar(err);
            });
    }

    agregarTarea(description) {
        const nuevaTarea = {
            "description": description,
            "completed": false
        };
        let settings = this.defaultSettings();
        settings.method = "POST";
        settings.headers.authorization = this.token;
        settings.body = JSON.stringify(nuevaTarea);
        fetch(`${this.url}/tasks`, settings)
            .then(respuesta => {
                return respuesta.json();
            }).then(datos => {
                renderizarTarea(datos);
            }).then(datos => {
                agregarEventListener(datos);
            }).catch(err => {
                alertar(err);
            });
    }

    crearTareas() {
        if (this.token !== null) {
            let settings = this.defaultSettings();
            settings.headers.authorization = this.token;
            fetch(`${this.url}/tasks`, settings)
                .then(respuesta => {
                    return respuesta.json();
                })
                .then(tareas => {
                    tareas.forEach(tarea => {
                        renderizarTarea(tarea);
                    });
                    return tareas;
                })
                .then(tareas => {
                    tareas.forEach(tarea => {
                        agregarEventListener(tarea);
                    });
                });

        }
    }
    
    actualizarTarea(id, nuevoEstado) {
        if (this.token !== null) {
            let settings = this.defaultSettings();
            settings.headers.authorization = this.token;
            settings.method = "PUT";
            settings.body = JSON.stringify({ completed: nuevoEstado });
            fetch(`${this.url}/tasks/${id}`, settings);
        }
    }

    eliminarTarea(id) {
        if (this.token !== null) {
            let settings = this.defaultSettings();
            settings.headers.authorization = this.token;
            settings.method = "DELETE";
            fetch(`${this.url}/tasks/${id}`, settings);
        }
    }
}