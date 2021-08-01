class RequestManager {

    static baseUrl = "https://ctd-todo-api.herokuapp.com/v1";

    static defaultSettings() {
        return  { 
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    static getToken() {
        return localStorage.getItem("token");
    }

    static get(endPoint) {
        const settings = RequestManager.defaultSettings();
        settings.headers.authorization = RequestManager.getToken();
        return fetch(RequestManager.baseUrl + endPoint, settings)
            .then(data => {
                return data.json();
            })
    }

    static post(endPoint, body) {
        const settings = RequestManager.defaultSettings();
        settings.headers.authorization = RequestManager.getToken();
        settings.method = "POST";
        settings.body = JSON.stringify(body)
        return fetch(this.baseUrl + endPoint, settings)
            .then(data => {
                return data.json();
            })
    }

    static put(endPoint, body) {
        const settings = RequestManager.defaultSettings();
        settings.headers.authorization = RequestManager.getToken();
        settings.method = "PUT";
        settings.body = JSON.stringify(body);
        return fetch(this.baseUrl + endPoint, settings).then(data => {
            return data.json();
        })
    }

  static delete(endPoint) {
        const settings = RequestManager.defaultSettings();
        settings.headers.authorization = RequestManager.getToken();
        settings.method = "DELETE";
        return fetch(this.baseUrl + endPoint, settings).then(data => {
            return data.json();
        })
    }
}