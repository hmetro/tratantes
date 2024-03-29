import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';
import App from '../app';
import Loader from '../loader';
import m from 'mithril';



class DataProviderInter {
    static data = [];
    static filteredData = [];
    static searchField = "";
    static show = "";
    static fetch() {
        DataProviderInter.filterData();
    }
    static loadData() {
        DataProviderInter.fetch();
    }
    static filterData() {
        var to = Math.min(DataProviderInter.from + DataProviderInter.count, DataProviderInter.data.length + 1);
        DataProviderInter.filteredData = [];
        for (var i = DataProviderInter.from - 1; i < to - 1; i++) {
            DataProviderInter.filteredData.push(DataProviderInter.data[i]);
        }
    }
    static from = 1;
    static count = 1000;
    static setFrom(from) {
        DataProviderInter.from = parseInt(from);
        DataProviderInter.filterData();
    }

    static setCount(count) {
        DataProviderInter.count = parseInt(count);
        DataProviderInter.filterData();
    }
    static nextPage() {
        var from = DataProviderInter.from + DataProviderInter.count;
        if (from > DataProviderInter.data.length)
            return;
        DataProviderInter.from = from;
        DataProviderInter.filterData();
    }
    static lastPage() {
        DataProviderInter.from = DataProviderInter.data.length - DataProviderInter.count + 1;
        DataProviderInter.filterData();
    }
    static prevPage() {
        DataProviderInter.from = Math.max(1, DataProviderInter.from - DataProviderInter.count);
        DataProviderInter.filterData();
    }
    static firstPage() {
        DataProviderInter.from = 1;
        DataProviderInter.filterData();
    }
    static rowBack() {
        DataProviderInter.from = Math.max(1, DataProviderInter.from - 1);
        DataProviderInter.filterData();
    }
    static rowFwd() {
        if (DataProviderInter.from + DataProviderInter.count - 1 >= DataProviderInter.data.length)
            return;
        DataProviderInter.from += 1;
        DataProviderInter.filterData();
    }

};


class DataProvider {
    static data = [];
    static filteredData = [];
    static searchField = "";
    static show = "";
    static loader = true;
    static fetchBusqueda() {

        DataProvider.loader = true;
        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/mis-pacientes?start=0&length=1000" + ((DataProvider.searchField.length !== 0) ? "&searchField=" + DataProvider.searchField : ""),
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

                DataProvider.loader = false;

                if (result.status) {


                    Pacientes.codMedico = result.codMedico;
                    DataProvider.data = result.dataTra;
                    DataProvider.filterData();

                    DataProviderInter.data = result.dataInter;
                    DataProviderInter.loadData();

                    if (DataProvider.data.length == 0 && DataProviderInter.data.length !== 0) {
                        dataView.show = "d-none";
                        dataViewInter.show = "";
                    }

                    if (DataProvider.data.length !== 0 && DataProviderInter.data.length == 0) {
                        dataView.show = "";
                        dataViewInter.show = "d-none";
                    }


                } else {
                    alert('No existe resultados para tu búsqueda.')
                }




            })
            .catch(function (e) {
                DataProvider.fetchBusqueda();
            })




    }
    static fetch() {



        DataProvider.loader = true;
        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/mis-pacientes?start=0&length=1000" + ((DataProvider.searchField.length !== 0) ? "&searchField=" + DataProvider.searchField : ""),
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

                DataProvider.loader = false;

                if (result.status) {


                    Pacientes.codMedico = result.codMedico;
                    DataProvider.data = result.dataTra;
                    DataProvider.filterData();

                    DataProviderInter.data = result.dataInter;
                    DataProviderInter.loadData();




                } else {
                    alert('No existe resultados para tu búsqueda.')
                }




            })
            .catch(function (e) {
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
    oninit = DataProvider.loadData;
    oncreate() {
        Pacientes.submitBusqueda();
    }
    view() {

        if (!DataProvider.loader) {
            return m('table.w-100.mt-5.' + dataView.show, [
                m('tbody', DataProvider.filteredData.map(function (d) {
                    return [
                        m("div.bg-white.pt-4.pl-4.pb-4.pr-4.info-box.m-mb-30.radius-5", {
                            "style": { "border-color": "#0aa1eb" }
                        }, [
                            m("h4.mb-0", [
                                m("i.icofont-ui-user"),
                                " " + d['NOMBRE_PACIENTE']
                            ]

                            ),
                            m("div.media.",
                                m("div.media-body", [
                                    m("p.designation.text-uppercase", [
                                        d['EDAD'],
                                        " Año(s)",
                                        " Especialidad: ",
                                        d['ESPECIALIDAD'],
                                        " Médico: ",
                                        d['NOMBRE_MEDICO'],
                                    ]),

                                    m("h6",
                                        (d['DG_PRINCIPAL'] !== null) ? "Dg: " + d['DG_PRINCIPAL'] : "Dg: NO DISPONIBLE",
                                        m('br'),
                                        (" Fecha Admisión: " + d['FECHA_ADMISION']),
                                        m('br'),
                                        (d['NRO_HABITACION'] !== null) ? " Ubicación: " + d['NRO_HABITACION'] : " Ubicación: NO DISPONIBLE",
                                        ((Pacientes.codMedico == '0') ? [
                                            m('br'),
                                            (d['DISCRIMINANTE'] == 'EMA') ? " En Emergencia " : " En Hospitalización "

                                        ] : [
                                            m('br'),
                                            (d['CLASIFICACION_MEDICO'] === 'TRA') ? " MED: TRATANTE" : " MED: INTERCONSULTA ",

                                        ])
                                    ),

                                    m("div.text-right", [
                                        m("a.btn.medim-btn.solid-btn.mt-4.text-medium.radius-pill.text-active.text-uppercase.bg-transparent.position-relative", {
                                            href: "/paciente/" + d['HC']
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

class dataViewInter {
    static show = "d-none";
    oninit = DataProviderInter.loadData;
    view() {
        if (!DataProvider.loader) {
            return m('table.w-100.mt-5.' + dataViewInter.show, [
                m('tbody', DataProviderInter.filteredData.map(function (d) {
                    return [
                        m("div.bg-white.pt-4.pl-4.pb-4.pr-4.info-box.m-mb-30.radius-5", {
                            "style": { "border-color": "#0aa1eb" }
                        }, [
                            m("h4.mb-0", [
                                m("i.icofont-ui-user"),
                                " " + d['NOMBRE_PACIENTE']
                            ]

                            ),
                            m("div.media.",
                                m("div.media-body", [
                                    m("p.designation.text-uppercase", [
                                        d['EDAD'],
                                        " Año(s)",
                                        " Especialidad: ",
                                        d['ESPECIALIDAD'],
                                        " Médico: ",
                                        d['NOMBRE_MEDICO'],
                                    ]),

                                    m("h6",
                                        (d['DG_PRINCIPAL'] !== null) ? "Dg: " + d['DG_PRINCIPAL'] : "Dg: NO DISPONIBLE",
                                        m('br'),
                                        (" Fecha Admisión: " + d['FECHA_ADMISION']),
                                        m('br'),
                                        (d['NRO_HABITACION'] !== null) ? " Ubicación: " + d['NRO_HABITACION'] : " Ubicación: NO DISPONIBLE",
                                        ((Pacientes.codMedico == "0") ? [
                                            m('br'),
                                            (d['DISCRIMINANTE'] == 'EMA') ? " En Emergencia " : " En Hospitalización "

                                        ] : [
                                            m('br'),
                                            (d['CLASIFICACION_MEDICO'] === 'TRA') ? " MED: TRATANTE" : " MED: INTERCONSULTA ",

                                        ])
                                    ),

                                    m("div.text-right", [
                                        m("a.btn.medim-btn.solid-btn.mt-4.text-medium.radius-pill.text-active.text-uppercase.bg-transparent.position-relative", {
                                            href: "/paciente/" + d['HC']
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
            return;
        }

    }
};

class pageTool {
    view() {
        if (DataProvider.loader == false && DataProvider.data.length !== 0 && DataProvider.filteredData.length !== 0) {
            if (DataProvider.data.length === 0) {

                return [
                    m("div.d-inline", [
                        m('span', ' (0)'),
                    ]),
                ]

            } else if (DataProvider.data.length > 10) {

                return [
                    m("div.d-inline", [
                        m('span', ' (' + DataProvider.data.length + ')'),
                    ]),

                ]

            } else {
                return [
                    m("div.d-inline", [
                        m('span', ' (' + DataProvider.data.length + ')'),
                    ]),
                ]


            }
        }
    }
};

class pageToolInter {
    view() {

        if (DataProvider.loader == false && DataProviderInter.data.length !== 0 && DataProviderInter.filteredData.length !== 0) {
            if (DataProviderInter.data.length === 0) {

                return [
                    m("div.d-inline", [
                        m('span', ' (0)'),
                    ]),
                ]

            } else if (DataProviderInter.data.length > 10) {

                return [
                    m("div.d-inline", [
                        m('span', ' (' + DataProviderInter.data.length + ')'),
                    ]),


                ]

            } else {
                return [
                    m("div.d-inline", [
                        m('span', ' (' + DataProviderInter.data.length + ')'),
                    ]),
                ]


            }
        }

    }
};



class Pacientes extends App {
    static codMedico = "";
    constructor() {
        super();
    }

    oninit() {

        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
        this._setTitle = "Mis Pacientes";
    }
    static submitBusqueda() {
        document.onkeypress = function (e) {
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
                                    "Mis Pacientes "
                                ),
                                (!DataProvider.loader ? m("span.icon-section-wave.d-inline-block.text-active.section-wave.mt-3.active") : "")
                            ])
                        )
                    ),
                    m("div.row.m-mt-30.m-mb-20",

                        (DataProvider.filteredData.length !== 0 || DataProviderInter.filteredData.length !== 0 ? [m("div.col-md-12", [
                            m("div.d-flex.align-items-left.position-relative.justify-content-left", [
                                m("div.custom-control.custom-radio.m-mb-20.mr-2.fz-20", {
                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='tratante'][name='typeShow'][value='tratante']", {
                                        oncreate: (e) => {
                                            if (DataProvider.data.length !== 0 && DataProviderInter.data.length !== 0) {
                                                e.dom.checked = true;
                                            }
                                        },
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                dataView.show = "";
                                                dataViewInter.show = "d-none";
                                            }
                                        }

                                    }),
                                    m("label.custom-control-label[for='tratante']", [
                                        ((Pacientes.codMedico == "0") ? "Emergencia" : "Soy Tratante"),
                                        m(pageTool)
                                    ]

                                    )
                                ]),
                                m("div.custom-control.custom-radio.m-mb-20.ml-2.mr-2", {
                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='inter'][name='typeShow'][value='inter']", {
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                dataView.show = "d-none";
                                                dataViewInter.show = "";
                                            }
                                        }
                                    }),
                                    m("label.custom-control-label[for='inter']", [
                                        ((Pacientes.codMedico == "0") ? "Hospitalización" : "Interconsulta"),

                                        m(pageToolInter)

                                    ])
                                ]),


                            ]),
                            m("div.input-group.banenr-seach.bg-white.m-mt-30.mb-0", [
                                m("input.form-control[type='text'][placeholder='Buscar por Apellidos y Nombres']", {
                                    oninput: function (e) {
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
                                            DataProvider.fetchBusqueda();
                                        },
                                    }),
                                    m("button.btn[type='button'][id='actBuscar']", {
                                        onclick: () => {
                                            DataProvider.fetchBusqueda();
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
                            m(dataView)
                        ),
                        m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                            m(dataViewInter)
                        )
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

        ];
    }
};



export default Pacientes;