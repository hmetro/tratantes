import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';
import App from '../app';
import Loader from '../loader';


class DataProvider {
    static data = [];
    static filteredData = [];
    static searchField = "";
    static tipoBusqueda = "";
    static show = "";
    static loader = true;
    static fetch() {

        DataProvider.loader = true;

        if (DataProvider.tipoBusqueda == 'pte' && DataProvider.searchField.length !== 0) {

            let _l = countWords(DataProvider.searchField);

            if (_l >= 2) {

                m.request({
                        method: "POST",
                        url: "https://api.hospitalmetropolitano.org/v2/medicos/buscar-paciente",
                        body: {
                            tipoBusqueda: DataProvider.tipoBusqueda,
                            pte: DataProvider.searchField
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
                        DataProvider.data = [];
                        DataProvider.data = result.data;
                        DataProvider.filterData();
                    })
                    .catch(function(e) {})


            } else {
                DataProvider.loader = false;
                alert('¡Escriba 2 Apellidos o Nombres para continuar.!')
            }

        } else {

            m.request({
                    method: "POST",
                    url: "https://api.hospitalmetropolitano.org/t/v1/buscar-paciente",
                    body: {
                        tipoBusqueda: DataProvider.tipoBusqueda,
                        pte: DataProvider.searchField
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
                    DataProvider.data = [];
                    DataProvider.data = result.data;
                    DataProvider.filterData();
                })
                .catch(function(e) {

                })

        }

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
    oninit = DataProvider.loadData;
    oncreate() {
        ResultadoPacientes.submitBusqueda();
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
                                    m("i.icofont-ui-user"),
                                    " " + d['APELLIDOS'] + ' ' + d['NOMBRES']
                                ]

                            ),
                            m("div.media.",
                                m("div.media-body", [
                                    m("p.designation.text-uppercase", [
                                        "NHC:",
                                        d['PK_NHCL'],
                                    ]),



                                    m("div.text-right", [
                                        m("a.btn.medim-btn.solid-btn.mt-4.text-medium.radius-pill.text-active.text-uppercase.bg-transparent.position-relative", {
                                                href: "/resultados/paciente/" + d['PK_NHCL']
                                            },
                                            " Ver Paciente "
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


class ResultadoPacientes extends App {
    static codMedico = "";
    constructor() {
        super();
    }

    oninit() {

        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
        this._setTitle = "Resultados de Imagen y Laboratorio";
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
                                    "Resultados de Imagen y Laboratorio"
                                ),
                                (!DataProvider.loader ? m("span.icon-section-wave.d-inline-block.text-active.section-wave.mt-3.active") : "")
                            ])
                        )
                    ),
                    m("div.row.m-mt-30.m-mb-20",

                        (!DataProvider.laoder ? [m("div.col-md-12", [
                            m("div.d-flex.align-items-left.position-relative.justify-content-left", [

                                m("div.custom-control.custom-radio.m-mb-20.ml-2.mr-2", {

                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='cedula'][name='tipoBusqueda'][value='cc']", {
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                DataProvider.tipoBusqueda = e.target.value;
                                            }
                                        },
                                        oncreate: (el) => {
                                            DataProvider.tipoBusqueda = 'cc';
                                            el.dom.checked = true;
                                        },

                                    }),
                                    m("label.custom-control-label[for='cedula']",
                                        "Cédula"
                                    )
                                ]),
                                m("div.custom-control.custom-radio.m-mb-20.ml-2.mr-2", {
                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='nhc'][name='tipoBusqueda'][value='nhc']", {
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                DataProvider.tipoBusqueda = e.target.value;
                                            }
                                        }
                                    }),
                                    m("label.custom-control-label[for='nhc']",
                                        "Historia Clínica"
                                    )
                                ]),
                                m("div.custom-control.custom-radio.m-mb-20.mr-2.fz-20", {
                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='pte'][name='tipoBusqueda'][value='pte']", {
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                DataProvider.tipoBusqueda = e.target.value;
                                            }
                                        }
                                    }),
                                    m("label.custom-control-label[for='pte']",
                                        "Apellidos y Nombres"
                                    )
                                ]),



                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-30.mb-0", [
                                m("input.form-control[type='text'][placeholder='Buscar por Cédula, Historia Clínica, Apellidos y Nombres']", {
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
                        ])] : [])


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
                m("a.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[href='/']", [
                    m("i.icofont-home"),
                    " Inicio "
                ])
            )
        ];
    }
};


function countWords(str) {
    return str.trim().split(/\s+/).length;
}


export default ResultadoPacientes;