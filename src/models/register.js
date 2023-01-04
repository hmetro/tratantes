import App from '../views/app';
import _Error_ from '../views/error';


class Register {
    static username = "";
    static password = "";
    static twoPassword = "";
    static correoElectronico = "";
    static messageError = "";
    static statusHide = " d-none";
    static statusError = "warning";
    static imputDisabled = false;
    static imputDisabledRUC = false;
    static rol = 0;
    static codMedico = "";
    static isValidated = false;
    static isMailHM = false;
    static dataUser = [];
    static setUsername(value) {
        Register.username = value;
        if (Register.password !== Register.twoPassword) {
            Register.statusHide = "";
            Register.statusError = "danger";
            Register.messageError = "nO ";
        }
    }
    static setPassword(value) {
        Register.statusHide = "d-none";
        Register.password = value
        if (Register.password.length < 5) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            Register.statusHide = "";
            Register.statusError = "danger";
            Register.messageError = "La contraseña debe ser mayor a 5 caracteres.";
        }
    }
    static setTwoPassword(value) {
        Register.statusHide = "d-none";
        Register.twoPassword = value;
        if (Register.password !== Register.twoPassword) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            Register.statusHide = "";
            Register.statusError = "danger";
            Register.messageError = "Las contraseñas no coinciden. ";
        }
        if (Register.twoPassword.length < 5) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            Register.statusHide = "";
            Register.statusError = "danger";
            Register.messageError = "La contraseña debe ser mayor a 5 caracteres.";
        }

    }
    static setCorreo(value) {
        Register.correoElectronico = value
    }
    static canSubmitRUC() {
        return Register.username !== "";
    }
    static canSubmit() {
        return Register.username !== "" && Register.password !== "" && Register.twoPassword !== "" && Register.correoElectronico !== "" && (Register.password === Register.twoPassword);
    }
    static setError(message) {
        Register.statusHide = "";
        Register.statusError = "danger";
        Register.messageError = message;
    }
    static setSuccess(message) {
        Register.statusHide = "";
        Register.statusError = "success";
        Register.messageError = message;
    }
    static setProcess() {
        Register.statusHide = "";
        Register.statusError = "warning";
        Register.messageError = 'Procesando...';
    }
    static register() {
        Register.imputDisabled = true;
        Register.setProcess();
        return m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/v2/medicos/register",
                body: {
                    user: Register.username,
                    pass: Register.password,
                    email: Register.correoElectronico
                }
            })
            .then(function(data) {

                if (data.status) {
                    alert('Proceso realizado con éxito. Hemos enviado un correo electrónico a: ' + Register.correoElectronico);
                    location.href = "/";
                } else {
                    Register.imputDisabled = false;
                    Register.statusHide = "d-none";
                    Register.statusError = "warning";
                    Register.messageError = "";
                    Register.setError(data.message);
                }

            }).catch(function(error) {

                Register.register();
            });
    }
    static isLogin() {

        if (window.localStorage.getItem('accessToken') !== undefined && window.localStorage.getItem('accessToken')) {
            return true;
        } else {
            return false
        }

    }
    static validarRUC() {
        Register.setProcess();
        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/v2/medicos/vruc",
                body: {
                    user: Register.username,
                }
            })
            .then(function(data) {
                if (data.status) {
                    Register.isValidated = true;
                    Register.imputDisabledRUC = true;
                    Register.statusHide = "d-none";
                    Register.statusError = "warning";
                    Register.messageError = "";
                    Register.dataUser = data.data;
                    alert("N° de RUC validado con éxito, puede continuar. \n***Importante:*** Si tiene disponible un correo: @hmetro.med.ec, a continuación puede utilizar esa dirección y conservar su misma contraseña.");
                } else {
                    Register.imputDisabledRUC = false;
                    Register.statusHide = "d-none";
                    Register.statusError = "warning";
                    Register.messageError = "";
                    Register.setError(data.message);
                }

            }).catch(function(error) {

                Register.login();
            });
    }

};




export default Register;