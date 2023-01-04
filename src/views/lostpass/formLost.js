class FormLostPass {

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
    static tempPassword = "";
    static token = "";
    static setUsername(value) {
        FormLostPass.username = value;
        if (FormLostPass.password !== FormLostPass.twoPassword) {
            FormLostPass.statusHide = "";
            FormLostPass.statusError = "danger";
            FormLostPass.messageError = "nO ";
        }
    }
    static setTempPassword(value) {
        FormLostPass.statusHide = "d-none";
        FormLostPass.tempPassword = value
        if (FormLostPass.tempPassword.length < 5) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            FormLostPass.statusHide = "";
            FormLostPass.statusError = "danger";
            FormLostPass.messageError = "La contraseña debe ser mayor a 5 caracteres.";
        }
    }
    static setPassword(value) {
        FormLostPass.statusHide = "d-none";
        FormLostPass.password = value
        if (FormLostPass.password.length < 5) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            FormLostPass.statusHide = "";
            FormLostPass.statusError = "danger";
            FormLostPass.messageError = "La contraseña debe ser mayor a 5 caracteres.";
        }
    }
    static sendLostPass() {
        FormLostPass.setProcess();
        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/v2/medicos/lostpass",
                body: {
                    token: FormLostPass.token,
                    tempPass: FormLostPass.tempPassword,
                    pass: FormLostPass.password
                }
            })
            .then(function(data) {
                alert(data.message);
                if (data.status) {
                    location.href = "/";
                }

            }).catch(function(error) {
                FormLostPass.sendLostPass;
            });
    }
    static validarTokenRecovery(token) {
        FormLostPass.token = token;
        FormLostPass.setProcess();
        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/v2/medicos/token",
                body: {
                    token: token,
                }
            })
            .then(function(data) {
                alert(data.message);
                if (data.status) {
                    FormLostPass.isValidated = true;
                    FormLostPass.imputDisabledRUC = true;
                    FormLostPass.username = data.data.user;
                    FormLostPass.statusHide = "d-none";
                    FormLostPass.statusError = "warning";
                    FormLostPass.messageError = "";
                    FormLostPass.dataUser = data.data;
                }
            }).catch(function(error) {
                FormLostPass.validarTokenRecovery(token);
            });
    }
    static recoveryPass() {
        FormLostPass.setProcess();
        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/v2/medicos/recovery",
                body: {
                    user: FormLostPass.username,
                }
            })
            .then(function(data) {
                alert(data.message);
                if (data.status) {
                    location.href = "/";
                }
            }).catch(function(error) {
                FormLostPass.recoveryPass;
            });
    }
    static setTwoPassword(value) {
        FormLostPass.statusHide = "d-none";
        FormLostPass.twoPassword = value;
        if (FormLostPass.password !== FormLostPass.twoPassword) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            FormLostPass.statusHide = "";
            FormLostPass.statusError = "danger";
            FormLostPass.messageError = "Las contraseñas no coinciden. ";
        }
        if (FormLostPass.twoPassword.length < 5) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            FormLostPass.statusHide = "";
            FormLostPass.statusError = "danger";
            FormLostPass.messageError = "La contraseña debe ser mayor a 5 caracteres.";
        }

    }
    static setCorreo(value) {
        FormLostPass.correoElectronico = value
    }
    static canSubmitRUC() {
        return FormLostPass.username !== "";
    }
    static canSubmit() {
        return FormLostPass.username !== "" && FormLostPass.tempPassword !== "" && FormLostPass.password !== "" && FormLostPass.twoPassword !== "";
    }
    static setError(message) {
        FormLostPass.statusHide = "";
        FormLostPass.statusError = "danger";
        FormLostPass.messageError = message;
    }
    static setSuccess(message) {
        FormLostPass.statusHide = "";
        FormLostPass.statusError = "success";
        FormLostPass.messageError = message;
    }
    static setProcess() {
        FormLostPass.statusHide = "";
        FormLostPass.statusError = "warning";
        FormLostPass.messageError = 'Procesando...';
    }
    static submitLostPass() {
        document.onkeypress = function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == "13") {
                if (FormLostPass.isValidated) {
                    if (FormLostPass.canSubmit()) {
                        document.getElementsByTagName('button')[1].click();
                    }
                } else {
                    if (FormLostPass.canSubmitRUC()) {
                        document.getElementsByTagName('button')[0].click();
                    }
                }
            }
        };
    }

    oncreate() {

        FormLostPass.submitLostPass();
    }
    view() {


        return [
            m("section.m-pt-10.m-pb-90.m-bg-1",
                m("div.container",
                    m("div.row",
                        m("div.col-md-6.offset-md-3",
                            m("div.text-center.m-mt-70", [
                                m("h2.m-0.text-dark",
                                    (!FormLostPass.isValidated ? "Recuperación de contraseña" : "Nueva Contraseña")

                                ),
                                m("p.m-mt-10",
                                    "Ingrese su información para continuar"
                                )
                            ])
                        ),
                        m("div.col-md-12.text-center.", [
                            m("div.loader-content." + ((FormLostPass.messageError === "Procesando...") ? "" : "d-none"),
                                m("span.icon-section-wave.d-inline-block.text-active.mt-2.", )
                            ),
                            m("div." + ((FormLostPass.messageError === "Procesando..." || FormLostPass.statusHide) ? "d-none" : "") + ".alert.alert-solid.response.alert-" + FormLostPass.statusError + "[role='alert']",
                                FormLostPass.messageError
                            ),
                        ]),
                        m("div.col-md-12." + ((FormLostPass.messageError !== "Procesando...") ? "" : "d-none"),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", [
                                m("input.form-control[type='text'][placeholder='N° de RUC']", {
                                    oninput: function(e) { FormLostPass.setUsername(e.target.value) },
                                    value: FormLostPass.username,
                                    disabled: FormLostPass.imputDisabledRUC,
                                }),
                                m("div.input-group-append", {
                                        class: (FormLostPass.isValidated ? "d-none" : "")
                                    },

                                    m("button.btn[type='button']", {
                                            disabled: !FormLostPass.canSubmitRUC(),
                                            onclick: FormLostPass.recoveryPass
                                        },
                                        "Enviar"
                                    )
                                )
                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (!FormLostPass.isValidated ? "d-none" : "")
                            }, [
                                m("input.form-control[type='text'][placeholder='Contraseña Temporal']", {
                                    oninput: function(e) { FormLostPass.setTempPassword(e.target.value) },
                                    value: FormLostPass.tempPassword,
                                    disabled: FormLostPass.imputDisabled,
                                }),

                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (!FormLostPass.isValidated ? "d-none" : "")
                            }, [
                                m("input.form-control[type='text'][placeholder='Nueva Contraseña']", {
                                    oninput: function(e) { FormLostPass.setPassword(e.target.value) },
                                    value: FormLostPass.password,
                                    disabled: FormLostPass.imputDisabled,
                                }),

                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (!FormLostPass.isValidated ? "d-none" : "")
                            }, [
                                m("input.form-control[type='text'][placeholder='Repetir Nueva Contraseña']", {
                                    oninput: function(e) { FormLostPass.setTwoPassword(e.target.value) },
                                    value: FormLostPass.twoPassword,
                                    disabled: FormLostPass.imputDisabled,
                                }),

                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (FormLostPass.isValidated ? "" : "d-none")
                            }, [

                                m("p.mt-auto.mr-auto", {
                                        style: { "color": "red" }
                                    },

                                    "Al hacer clic en Enviar se procesará esta solicitud. Esta acción no podrá ser revertida."
                                ),
                                m("div.input-group-append",
                                    m("button.btn[type='button']", {
                                            disabled: !FormLostPass.canSubmit(),
                                            onclick: FormLostPass.sendLostPass
                                        },
                                        "Enviar"
                                    )
                                )
                            ]),
                            m("div.mt-5.text-center", [
                                "¿Ya tienes una cuenta? ",
                                m("a.text-15.text-primary", {
                                        style: { "cursor": "pointer" },
                                        href: "/auth"
                                    },
                                    "Entrar"
                                )
                            ]),

                        ),

                    ),

                )
            ),

        ];

    }

};


export default FormLostPass;