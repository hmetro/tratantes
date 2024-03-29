import App from '../views/app';
import _Error_ from '../views/error';




class Auth {
    username = "";
    password = "";
    messageError = "";
    statusHide = " d-none";
    statusError = "warning";
    imputDisabled = false;
    rol = 0;
    codMedico = "";
    static getDataUser() {
        let token = localStorage.accessToken;
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
    static setUsername(value) {
        Auth.username = value
    }
    static setPassword(value) {
        Auth.password = value
    }
    static canSubmit() {
        return Auth.username !== "" && Auth.password !== "";
    }
    static setError(message) {
        Auth.statusHide = "";
        Auth.statusError = "danger";
        Auth.messageError = message;

    }
    static setSuccess(message) {
        Auth.statusHide = "";
        Auth.statusError = "success";
        Auth.messageError = message;

    }
    static setProcess() {
        Auth.statusHide = "";
        Auth.statusError = "warning";
        Auth.messageError = 'Procesando...';
    }
    static login() {
        Auth.imputDisabled = true;
        Auth.setProcess();
        return m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/auth",
            body: {
                user: Auth.username,
                pass: Auth.password
            }
        })
            .then(function (data) {

                if (data.status) {
                    window.localStorage.accessToken = data.jwt;
                    Auth.setSuccess('Bienvenido');
                    setTimeout(function () {
                        Auth.imputDisabled = false;
                        Auth.statusHide = "d-none";
                        Auth.statusError = "warning";
                        Auth.messageError = "";
                        Auth.username = "";
                        Auth.password = "";
                        Auth.rol = parseInt(data.data.user.rol);
                        Auth.codMedico = data.data.user.codMedico;
                        App.isAuth()
                    }, 900);
                } else {
                    Auth.imputDisabled = false;
                    Auth.statusHide = "d-none";
                    Auth.statusError = "warning";
                    Auth.messageError = "";
                    Auth.setError(data.message);
                }

            }).catch(function (error) {

                Auth.login();
            });
    }
    static isLogin() {

        if (window.localStorage.getItem('accessToken') !== undefined && window.localStorage.getItem('accessToken')) {
            return true;
        } else {
            return false
        }

    }
};




export default Auth;