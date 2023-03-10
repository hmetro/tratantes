import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';
import App from '../app';
import Loader from '../loader';
import m from 'mithril';

class DataProvider {
    static data = [];
    static filteredData = [];
    static searchField = "";
    static show = "";
    static loader = true;
    static fetch() {

        DataProvider.loader = true;
        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/v2/medicos/honorarios/auditados?typeFilter=" + dataView.typeFilter + "&start=0&length=1000" + (dataView.typeFilter == 3 ? "&fechaDesde=" + HonoAuditados.fechaDesde + "&fechaHasta=" + HonoAuditados.fechaHasta : ""),
                body: {
                    searchField: DataProvider.searchField
                },
                headers: {
                    "Authorization": localStorage.accessToken,
                },
                extract: function(xhr) {

                    let jsonXHR = JSON.parse(xhr.responseText);

                    if (xhr.status === 500 && jsonXHR.status == false && jsonXHR.errorCode == 0) {
                        alert(jsonXHR.message);
                        window.location.href = "/salir";
                    }

                    return { status: xhr.status, body: JSON.parse(xhr.responseText) }

                }

            })
            .then(function(response) {

                let result = response.body;

                DataProvider.loader = false;

                if (result.status) {

                    HonoAuditados.codMedico = result.codMedico;
                    DataProvider.data = result.data;
                    DataProvider.filterData();

                } else {
                    alert('No existe resultados para tu búsqueda.')
                }




            })
            .catch(function(e) {
                DataProvider.fetch();
            })




    }
    static loadData() {
        DataProvider.fetch();
    }

    static filterData() {
        var to = Math.min(DataProvider.from + DataProvider.count, DataProvider.data.length + 1);
        DataProvider.filteredData = [];
        for (var i = DataProvider.from - 1; i < to - 1; i++) {
            DataProvider.filteredData.push(DataProvider.data[i]);
        }
    }

    static from = 1;
    static count = 1000;
    static setFrom(from) {
        DataProvider.from = parseInt(from);
        DataProvider.filterData();
    }
    static setCount(count) {
        DataProvider.count = parseInt(count);
        DataProvider.filterData();
    }
    static nextPage() {
        var from = DataProvider.from + DataProvider.count;
        if (from > DataProvider.data.length)
            return;
        DataProvider.from = from;
        DataProvider.filterData();
    }
    static lastPage() {
        DataProvider.from = DataProvider.data.length - DataProvider.count + 1;
        DataProvider.filterData();
    }
    static prevPage() {
        DataProvider.from = Math.max(1, DataProvider.from - DataProvider.count);
        DataProvider.filterData();
    }
    static firstPage() {
        DataProvider.from = 1;
        DataProvider.filterData();
    }
    static rowBack() {
        DataProvider.from = Math.max(1, DataProvider.from - 1);
        DataProvider.filterData();
    }
    static rowFwd() {
        if (DataProvider.from + DataProvider.count - 1 >= DataProvider.data.length)
            return;
        DataProvider.from += 1;
        DataProvider.filterData();
    }
};

class dataView {
    static show = "";
    static typeFilter = 4;
    static plFechaTransaccion = "";
    static plNumeroTransaccion = "";
    oninit = DataProvider.loadData;
    oncreate() {
        HonoAuditados.submitBusqueda();
    }
    static downloadPlanilla() {
        console.log('codMedico', HonoAuditados);
        console.log('dataView', dataView);
        window.location = 'https://api.hospitalmetropolitano.org/h2/v0/controlador/descarga_documentos/preparar_planilla_pago.php?proveedor=' + HonoAuditados.codMedico + '&fecha_transaccion=' + dataView.plFechaTransaccion + '&numero_transaccion=' + dataView.plNumeroTransaccion + '&tipo_imprime=PAGOS';
    }
    view() {

        if (!DataProvider.loader) {
            return m('table.w-100.mt-5.' + dataView.show, [
                m('tbody', DataProvider.filteredData.map(function(d) {
                    return [
                        m("div.bg-white.pt-4.pl-4.pb-4.pr-4.info-box.m-mb-30.radius-5", {
                            "style": { "border-color": "#0aa1eb" }
                        }, [
                            m("h4.mb-0", [
                                    m("i.icofont-file-alt.mr-1"),
                                    'N° de Prefactura: ' + d['PREFACTURA'] + ' Status: ' + (d['AUDITADO'] !== null ? (d['AUDITADO'] == 'S' ? '- Auditado' : '- En Proceso') : '- Sin Auditoría')
                                ]

                            ),
                            m("div.media.",
                                m("div.media-body", [


                                    m("h6.mt-2",
                                        "Fecha Pago: " + d['FECHA']
                                    ),
                                    m("h6.mt-2",
                                        "NHC: " + d['HCL'] + "Adm: " + d['ADM'] + " Paciente: " + d['NOMBRES']
                                    ),
                                    m("h6.mt-2",
                                        "Dcto.:" + d['DCTO']
                                    ),
                                    m("h6.mt-2",
                                        "Valor: " + d['VALOR']
                                    ),

                                    m("h6",
                                        "Origen: " + d['ORIGEN']
                                    ),


                                    m("div.text-right.d-none", [
                                        m(".btn.medim-btn.solid-btn.mt-4.text-medium.radius-pill.text-active.text-uppercase.bg-transparent.position-relative", {
                                                onclick: () => {
                                                    // dataView.plFechaTransaccion = d['FECHA'];
                                                    // dataView.plNumeroTransaccion = d['NO_TRANSACCION'];
                                                    dataView.downloadPlanilla();
                                                }
                                            },
                                            " Ver Documento "
                                        )
                                    ])

                                ])
                            )
                        ]),

                    ]
                }))
            ]);
        } else {
            return m(Loader, { loaderMisPtes: true })

        }
    }
}

class pageTool {
    view() {
        if (DataProvider.loader == false && DataProvider.data.length !== 0 && dataView.show == "" && DataProvider.filteredData.length !== 0) {
            if (DataProvider.data.length === 0) {

                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(0) Resultado(s)'),
                    ]),
                ]

            } else if (DataProvider.data.length > 10) {

                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(' + DataProvider.data.length + ') Resultado(s) '),
                    ]),

                ]

            } else {
                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(' + DataProvider.data.length + ') Resultado(s) '),
                    ]),
                ]


            }
        }
    }
};

class HonoAuditados extends App {
    static codMedico = "";
    static showFechas = "d-none";
    static showSearch = "";
    static fechaDesde = "";
    static fechaHasta = "";
    constructor() {
        super();
    }
    oninit() {
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
        this._setTitle = "Honorarios Auditados";
    }
    static submitBusqueda() {
        document.onkeypress = function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == "13") {
                document.getElementById('actBuscar').click();
            }
        };
    }
    oncreate() {
        this.mainLayout();
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
                                    "Honorarios Auditados"
                                ),
                                (!DataProvider.loader ? m("span.icon-section-wave.d-inline-block.text-active.section-wave.mt-3.active") : "")
                            ])
                        )
                    ),
                    m("div.row.m-mt-30.m-mb-20",

                        (DataProvider.filteredData.length !== 0 ? [
                            m("div.col-md-12", [
                                m("div.d-flex.align-items-left.position-relative.justify-content-left", [
                                    m("div.custom-control.custom-radio.m-mb-20.mr-2.fz-20", {
                                        "style": {
                                            "font-size": "large"
                                        }
                                    }, [
                                        m("input.custom-control-input[type='radio'][id='paciente'][name='typeShow'][value='paciente']", {
                                            onclick: (e) => {
                                                if (e.target.checked) {
                                                    dataView.typeFilter = 1;
                                                    HonoAuditados.showSearch = "";
                                                    HonoAuditados.showFechas = "d-none";
                                                }
                                            },
                                            oncreate: (el) => {
                                                el.dom.checked = true;
                                            }

                                        }),
                                        m("label.custom-control-label[for='paciente']",
                                            "Por Apellidos y Nombres "
                                        )
                                    ]),
                                    m("div.custom-control.custom-radio.m-mb-20.ml-2.mr-2", {
                                        "style": {
                                            "font-size": "large"
                                        }
                                    }, [
                                        m("input.custom-control-input[type='radio'][id='factura'][name='typeShow'][value='factura']", {
                                            onclick: (e) => {
                                                if (e.target.checked) {
                                                    dataView.typeFilter = 2;
                                                    HonoAuditados.showSearch = "";
                                                    HonoAuditados.showFechas = "d-none";
                                                }
                                            }
                                        }),
                                        m("label.custom-control-label[for='factura']",
                                            "Por N° de Factura"
                                        )
                                    ]),
                                    m("div.custom-control.custom-radio.m-mb-20.ml-2.mr-2", {
                                        "style": {
                                            "font-size": "large"
                                        }
                                    }, [
                                        m("input.custom-control-input[type='radio'][id='fechasFacturas'][name='typeShow'][value='fechasFacturas']", {
                                            onclick: (e) => {
                                                if (e.target.checked) {
                                                    dataView.typeFilter = 3;
                                                    HonoAuditados.showSearch = "d-none";
                                                    HonoAuditados.showFechas = "";
                                                }
                                            }
                                        }),
                                        m("label.custom-control-label[for='fechasFacturas']",
                                            "Por Fechas"
                                        )
                                    ]),


                                ]),
                                m("div.input-group.banenr-seach.bg-white.m-mt-30.mb-0", {
                                    class: HonoAuditados.showSearch
                                }, [
                                    m("input.form-control[type='text'][placeholder='Buscar']", {
                                        oninput: function(e) {
                                            e.target.value = e.target.value.toUpperCase();
                                            DataProvider.searchField = e.target.value;
                                        },
                                        value: DataProvider.searchField,
                                    }),
                                    m("div.input-group-append",
                                        m("i.icofont-close.p-2.mt-1", {

                                            style: { "color": "rgba(108, 117, 125, 0.4) !important", "font-size": "xx-large" },
                                            class: (DataProvider.searchField.length !== 0) ? "" : "d-none",
                                            onclick: () => {
                                                DataProvider.searchField = "";
                                                DataProvider.fetch();
                                            },
                                        }),
                                        m("button.btn[type='button'][id='actBuscar']", {
                                                onclick: () => {
                                                    DataProvider.fetch();
                                                },
                                            },
                                            "Buscar"
                                        ),

                                    )
                                ]),
                                m("div.input-group.banenr-seach.bg-white.m-mt-30.mb-0", {
                                    class: HonoAuditados.showFechas
                                }, [
                                    m("label.d-inline", 'Desde:'),
                                    m("input.form-control[type='date'][placeholder='Desde'][id='fechaDesde']", {
                                        oninput: function(e) {
                                            HonoAuditados.fechaDesde = e.target.value;
                                        },
                                        value: HonoAuditados.fechaDesde,
                                    }),
                                    m("label.d-inline", 'Hasta:'),
                                    m("input.form-control[type='date'][placeholder='Desde'][id='fechaDesde']", {
                                        oninput: function(e) {
                                            HonoAuditados.fechaHasta = e.target.value;
                                        },
                                        value: HonoAuditados.fechaHasta,
                                    }),
                                    m("div.input-group-append",

                                        m("button.btn[type='button'][id='actBuscar']", {
                                                onclick: () => {
                                                    DataProvider.fetch();
                                                },
                                            },
                                            "Buscar"
                                        ),

                                    )
                                ]),
                            ]),
                        ] : [])


                    ),
                    m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                        m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                            m(pageTool),
                            m(dataView),

                        ),

                    ])
                )
            ),
            m("footer", [

                m("div.footer-bottom.text-center.m-mt-120.m-bg-1.pt-4.pb-4",
                    m("div.container",
                        m("div.row",
                            m("div.col-md-12", [
                                    m("img[alt='HM'][src='assets/images/logo-hm.svg'][width='75rem']"),
                                    m("p.mb-1.mt-1", [
                                        m.trust("&copy;"),
                                        new Date().getFullYear() + ". Todos los derechos reservados."
                                    ])

                                ]

                            )
                        )
                    )
                ),
                m("div.footer-bottom.text-center.m-mt-120.m-bg-1.pt-4.pb-4",
                    m("div.container",

                    )
                )
            ]),
            m("div.button-menu-center.text-center",
                m("a.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[href='/honorarios']", [
                    m("i.icofont-home"),
                    " Inicio "
                ])
            )
        ];
    }
};

export default HonoAuditados;