import Register from '../../models/register';

class FormRegistro {



    view() {

        return [
            m("section.m-pt-10.m-pb-90.m-bg-1",
                m("div.container",
                    m("div.row",
                        m("div.col-md-6.offset-md-3",
                            m("div.text-center.m-mt-70", [
                                m("h2.m-0.text-dark",
                                    "Crear nueva cuenta "
                                ),
                                m("p.m-mt-10",
                                    "Es gratis registrarse y solo toma un minuto."
                                )
                            ])
                        ),
                        m("div.col-md-12.text-center.", [
                            m("div.loader-content." + ((Register.messageError === "Procesando...") ? "" : "d-none"),
                                m("span.icon-section-wave.d-inline-block.text-active.mt-2.", )
                            ),
                            m("div." + ((Register.messageError === "Procesando..." || Register.statusHide) ? "d-none" : "") + ".alert.alert-solid.response.alert-" + Register.statusError + "[role='alert']",
                                Register.messageError
                            ),
                        ]),
                        m("div.col-md-12." + ((Register.messageError !== "Procesando...") ? "" : "d-none"),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", [
                                m("input.form-control[type='text'][placeholder='N° de RUC']", {
                                    oninput: function(e) { Register.setUsername(e.target.value) },
                                    value: Register.username,
                                    disabled: Register.imputDisabledRUC,
                                }),
                                m("div.input-group-append", {
                                        class: (Register.isValidated ? "d-none" : "")
                                    },

                                    m("button.btn[type='button']", {
                                            disabled: !Register.canSubmitRUC(),
                                            onclick: Register.validarRUC
                                        },
                                        "Regístrate"
                                    )
                                )
                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (Register.isValidated ? "" : "d-none")
                            }, [
                                m("input.form-control[type='text']", {
                                    value: Register.dataUser.NOMBRE,
                                    disabled: true,
                                }),

                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (Register.isMailHM || !Register.isValidated ? "d-none" : "")
                            }, [
                                m("input.form-control[type='text'][placeholder='Contraseña']", {
                                    oninput: function(e) { Register.setPassword(e.target.value) },
                                    value: Register.password,
                                    disabled: Register.imputDisabled,
                                }),

                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (Register.isMailHM || !Register.isValidated ? "d-none" : "")
                            }, [
                                m("input.form-control[type='text'][placeholder='Repetir Contraseña']", {
                                    oninput: function(e) { Register.setTwoPassword(e.target.value) },
                                    value: Register.twoPassword,
                                    disabled: Register.imputDisabled,
                                }),

                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (Register.isValidated ? "" : "d-none")
                            }, [


                                (Register.dataUser.length !== 0 ? [
                                    m("select.form-control.text-primary", {
                                        disabled: Register.imputDisabled,
                                        onchange: (e) => {
                                            if (e.target.value.includes("@hmetro.med.ec")) {
                                                Register.isMailHM = true;
                                            } else {
                                                Register.isMailHM = false;
                                            }
                                            Register.correoElectronico = e.target.value;
                                        },
                                    }, Register.dataUser.CORREOS.map(x =>
                                        m('option', x)
                                    ))
                                ] : []),




                            ]),
                            m("p.ml-3.mt-auto.mr-auto.text-primary", {
                                    class: (Register.isMailHM ? "" : "d-none")
                                },
                                "*Usaremos la contraseña de tu misma dirrección de correo electrónico."
                            ),
                            m("div.input-group.banenr-seach.bg-white.m-mt-20.mb-0", {
                                class: (Register.isValidated ? "" : "d-none")
                            }, [

                                m("p.mt-auto.mr-auto",
                                    "Al hacer clic en Regístrate aceptas nuestros términos de servicio y declaración de privacidad"
                                ),
                                m("div.input-group-append",
                                    m("button.btn[type='button']", {
                                            disabled: !Register.canSubmit(),
                                            onclick: Register.register
                                        },
                                        "Regístrate"
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


export default FormRegistro;