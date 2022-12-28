import Auth from "../../models/auth";
import App from "../app";
import HeaderPrivate from "../layout/header-private";

class EstadoCuenta extends App {
    static codMedico = "";
    static fechaDesde = "";
    static fechaHasta = "";
    constructor() {
        super();
    }
    oninit() {
        this._setTitle = "Estado de Cuenta";
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
        EstadoCuenta.fetch();
    }
    static fetch() {
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/mis-facturas-pendientes?typeFilter=1",
            headers: {
                "Authorization": localStorage.accessToken,
            },
            extract: function (xhr) {

                let jsonXHR = JSON.parse(xhr.responseText);

                if (xhr.status === 500 && jsonXHR.status == false && jsonXHR.errorCode == 0) {
                    alert(jsonXHR.message);
                    window.location.href = "/salir";
                }

                return { status: xhr.status, body: JSON.parse(xhr.responseText) }

            }
        })
            .then(function (response) {
                let result = response.body;
                EstadoCuenta.codMedico = result.codMedico;
            })
            .catch(function (e) {
                EstadoCuenta.fetch();
            })
    }
    static downloadEstadoCuenta() {
        window.location = 'https://api.hospitalmetropolitano.org/h2/v0/controlador/descarga_documentos/preparar_estado_cuenta.php?proveedor=' + EstadoCuenta.codMedico + '&fecha_desde=' + EstadoCuenta.fechaDesde + '&fecha_hasta=' + EstadoCuenta.fechaHasta;
    }
    view() {
        return [
            m(HeaderPrivate),
            m("section.m-bg-1",
                m("div.container",
                    m("div.row",
                        m("div.col-md-6.offset-md-3",
                            m("div.text-center.m-mt-70", [
                                m("h2.m-0.text-dark",
                                    "Estado de Cuenta "
                                ),
                                m("span.icon-section-wave.d-inline-block.text-active.section-wave.mt-3.active")
                            ])
                        )
                    ),
                    m("div.row.m-mt-30.m-mb-20",
                        m("div.col-md-12", [
                            m("div.d-flex.align-items-left.position-relative.justify-content-left", [

                                m("label",
                                    "Seleccione las fechas para su estado de cuenta:"
                                ),


                            ]),


                        ]),
                        m("div.input-group.banenr-seach.bg-white.m-mt-30.mb-0", [
                            m("label.d-inline", 'Desde:'),

                            m("input.form-control[type='date'][placeholder='Desde'][id='fechaDesde']", {
                                oninput: function (e) {
                                    let valMeses = moment().subtract(5, 'months').format('YYYY-MM-DD');
                                    let _val = moment(valMeses, 'YYYY-MM-DD').unix();
                                    let _ival = moment(e.target.value, 'YYYY-MM-DD').unix();
                                    if (_ival < _val) {
                                        alert("La fecha seleccionada no puede ser mayor a " + valMeses)
                                    } else {
                                        EstadoCuenta.fechaDesde = e.target.value;
                                    }
                                },
                                value: EstadoCuenta.fechaDesde,
                            }),
                            m("label.d-inline", 'Hasta:'),

                            m("input.form-control[type='date'][placeholder='Desde'][id='fechaDesde']", {
                                oninput: function (e) {
                                    let valMeses = moment().subtract(5, 'months').format('YYYY-MM-DD');
                                    let _val = moment(valMeses, 'YYYY-MM-DD').unix();
                                    let _ival = moment(e.target.value, 'YYYY-MM-DD').unix();
                                    if (_ival < _val) {
                                        alert("La fecha seleccionada no puede ser mayor a " + valMeses)
                                    } else {
                                        EstadoCuenta.fechaHasta = e.target.value;
                                    }
                                },
                                value: EstadoCuenta.fechaHasta,
                            }),
                            m("div.input-group-append",

                                m("button.btn[type='button'][id='actDescargarEC']", {
                                    onclick: () => {
                                        EstadoCuenta.downloadEstadoCuenta();
                                    },
                                },
                                    "Descargar"
                                ),

                            )
                        ]),

                    ),
                    m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                        m("div.col-12.pd-r-0.pd-l-0.pd-b-20",

                        ),

                    ])
                )
            ),
            m("div.button-menu-center.text-center",
                m("a.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[href='/honorarios']", [
                    m("i.icofont-home"),
                    " Inicio "
                ])
            )

        ];
    }

};





export default EstadoCuenta;