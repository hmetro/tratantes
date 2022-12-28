import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';
import App from '../app';
import Loader from '../loader';
import m from 'mithril';

class DataProviderPublicas {
    static data = [];
    static filteredData = [];
    static searchField = "";
    static show = "";
    static fetch() {



        DataProviderPublicas.data = [];

        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/mis-facturas-pendientes?typeFilter=" + dataViewPublicas.typeFilter,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {

                FacturasPendientes.codMedico = result.codMedico;
                DataProviderPublicas.data = result.data;
                if (DataProviderPublicas.data.length !== 0) {
                    document.querySelector('#publicas').click();
                }
                DataProviderPublicas.filterData();
            })
            .catch(function (e) {
                DataProviderPublicas.fetch();
            })




    }
    static loadData() {
        DataProviderPublicas.fetch();
    }
    static filterData() {
        var to = Math.min(DataProviderPublicas.from + DataProviderPublicas.count, DataProviderPublicas.data.length + 1);
        DataProviderPublicas.filteredData = [];
        for (var i = DataProviderPublicas.from - 1; i < to - 1; i++) {
            DataProviderPublicas.filteredData.push(DataProviderPublicas.data[i]);
        }
    }
    static from = 1;
    static count = 10;
    static setFrom(from) {
        DataProviderPublicas.from = parseInt(from);
        DataProviderPublicas.filterData();
    }
    static setCount(count) {
        DataProviderPublicas.count = parseInt(count);
        DataProviderPublicas.filterData();
    }
    static nextPage() {
        var from = DataProviderPublicas.from + DataProviderPublicas.count;
        if (from > DataProviderPublicas.data.length)
            return;
        DataProviderPublicas.from = from;
        DataProviderPublicas.filterData();
    }
    static lastPage() {
        DataProviderPublicas.from = DataProviderPublicas.data.length - DataProviderPublicas.count + 1;
        DataProviderPublicas.filterData();
    }
    static prevPage() {
        DataProviderPublicas.from = Math.max(1, DataProviderPublicas.from - DataProviderPublicas.count);
        DataProviderPublicas.filterData();
    }
    static firstPage() {
        DataProviderPublicas.from = 1;
        DataProviderPublicas.filterData();
    }
    static rowBack() {
        DataProviderPublicas.from = Math.max(1, DataProviderPublicas.from - 1);
        DataProviderPublicas.filterData();
    }
    static rowFwd() {
        if (DataProviderPublicas.from + DataProviderPublicas.count - 1 >= DataProviderPublicas.data.length)
            return;
        DataProviderPublicas.from += 1;
        DataProviderPublicas.filterData();
    }
};

class dataViewPublicas {
    static show = "d-none";
    static typeFilter = 3;
    static plFechaTransaccion = "";
    static plNumeroTransaccion = "";
    oninit = DataProviderPublicas.loadData;
    view() {
        return m('table.w-100.mt-5.' + dataViewPublicas.show, [
            m('tbody', DataProviderPublicas.filteredData.map(function (d) {
                return [
                    m("div.bg-white.pt-4.pl-4.pb-4.pr-4.info-box.m-mb-30.radius-5", {
                        "style": { "border-color": "#0aa1eb" }
                    }, [
                        m("h4.mb-0", [
                            m("i.icofont-bank.mr-1"),
                            'N° de Prefactura: ' + d['PREFACTURA']
                        ]

                        ),
                        m("div.media.",
                            m("div.media-body", [


                                m("h6.mt-2",
                                    "Fecha: " + d['FECHA']
                                ),
                                m("h6.mt-2",
                                    "N° Factura: " + d['FACTURA']
                                ),
                                m("h6",
                                    "NHC: " + d['HISTORIA_CLINICA']
                                ),
                                m("h6",
                                    "Paciente: " + d['PACIENTE']
                                ),
                                m("h6",
                                    "Monto: " + d['MONTO']
                                ),
                                m("h6",
                                    "Saldo: " + d['SALDO']
                                ),

                                m("h6",
                                    "Cliente: " + d['CLIENTE']
                                ),


                            ])
                        )
                    ]),

                ]
            }))
        ]);
    }
};

class pageToolPublicas {
    view() {

        if (DataProviderPublicas.data !== undefined && dataViewPublicas.show == "") {
            if (DataProviderPublicas.data.length === 0) {

                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(0) Resultado(s)'),
                    ]),
                ]

            } else if (DataProviderPublicas.data.length > 10) {

                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(' + DataProviderPublicas.data.length + ') Resultado(s) '),
                    ]),
                    m('div.d-flex.w-100.text-center.mt-5', [
                        m("div.w-50.w-20", [


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderPublicas.rowBack(); }
                            },
                                " << Anterior "
                            ),
                        ]),

                        m("div.w-50.w-20", [

                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderPublicas.rowFwd(); }
                            },
                                " Siguiente >>"
                            ),



                        ])
                    ]),
                    m('div.d-flex.w-100.text-center.mt-5', [
                        m("div.w-50.w-20", [
                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderPublicas.firstPage(); }
                            },
                                " | Inicio "
                            ),

                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderPublicas.prevPage(); }
                            },
                                " < Pág. Ant. "
                            ),

                        ]),

                        m("div.w-50.w-20", [


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderPublicas.nextPage(); }
                            },
                                " Pág. Sig. > "
                            ),


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderPublicas.lastPage(); }
                            },
                                " Fin | "
                            ),

                        ])
                    ])

                ]

            } else {
                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(' + DataProviderPublicas.data.length + ') Resultado(s) '),
                    ]),
                ]


            }
        }


    }
};


class DataProviderHM {
    static data = [];
    static filteredData = [];
    static searchField = "";
    static show = "";
    static fetch() {



        DataProviderHM.data = [];

        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/mis-facturas-pendientes?typeFilter=" + dataViewHM.typeFilter,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {

                FacturasPendientes.codMedico = result.codMedico;
                DataProviderHM.data = result.data;
                if (DataProviderHM.data.length !== 0) {
                    document.querySelector('#hm').click();
                }
                DataProviderHM.filterData();
            })
            .catch(function (e) {
                DataProviderHM.fetch();
            })




    }
    static loadData() {
        DataProviderHM.fetch();
    }
    static filterData() {
        var to = Math.min(DataProviderHM.from + DataProviderHM.count, DataProviderHM.data.length + 1);
        DataProviderHM.filteredData = [];
        for (var i = DataProviderHM.from - 1; i < to - 1; i++) {
            DataProviderHM.filteredData.push(DataProviderHM.data[i]);
        }
    }
    static from = 1;
    static count = 10;
    static setFrom(from) {
        DataProviderHM.from = parseInt(from);
        DataProviderHM.filterData();
    }
    static setCount(count) {
        DataProviderHM.count = parseInt(count);
        DataProviderHM.filterData();
    }
    static nextPage() {
        var from = DataProviderHM.from + DataProviderHM.count;
        if (from > DataProviderHM.data.length)
            return;
        DataProviderHM.from = from;
        DataProviderHM.filterData();
    }
    static lastPage() {
        DataProviderHM.from = DataProviderHM.data.length - DataProviderHM.count + 1;
        DataProviderHM.filterData();
    }
    static prevPage() {
        DataProviderHM.from = Math.max(1, DataProviderHM.from - DataProviderHM.count);
        DataProviderHM.filterData();
    }
    static firstPage() {
        DataProviderHM.from = 1;
        DataProviderHM.filterData();
    }
    static rowBack() {
        DataProviderHM.from = Math.max(1, DataProviderHM.from - 1);
        DataProviderHM.filterData();
    }
    static rowFwd() {
        if (DataProviderHM.from + DataProviderHM.count - 1 >= DataProviderHM.data.length)
            return;
        DataProviderHM.from += 1;
        DataProviderHM.filterData();
    }
};

class dataViewHM {
    static show = "d-none";
    static typeFilter = 2;
    static plFechaTransaccion = "";
    static plNumeroTransaccion = "";
    oninit = DataProviderHM.loadData;
    view() {
        return m('table.w-100.mt-5.' + dataViewHM.show, [
            m('tbody', DataProviderHM.filteredData.map(function (d) {
                return [
                    m("div.bg-white.pt-4.pl-4.pb-4.pr-4.info-box.m-mb-30.radius-5", {
                        "style": { "border-color": "#0aa1eb" }
                    }, [
                        m("h4.mb-0", [
                            m("i.icofont-bank.mr-1"),
                            'N° de Prefactura: ' + d['PREFACTURA']
                        ]

                        ),
                        m("div.media.",
                            m("div.media-body", [


                                m("h6.mt-2",
                                    "Fecha: " + d['FECHA']
                                ),
                                m("h6.mt-2",
                                    "N° Factura: " + d['FACTURA']
                                ),
                                m("h6",
                                    "NHC: " + d['HISTORIA_CLINICA']
                                ),
                                m("h6",
                                    "Paciente: " + d['PACIENTE']
                                ),
                                m("h6",
                                    "Monto: " + d['MONTO']
                                ),
                                m("h6",
                                    "Saldo: " + d['SALDO']
                                ),

                                m("h6",
                                    "Cliente: " + d['CLIENTE']
                                ),


                            ])
                        )
                    ]),

                ]
            }))
        ]);
    }
};


class pageToolHM {
    view() {

        if (DataProviderHM.data !== undefined && dataViewHM.show == "") {
            if (DataProviderHM.data.length === 0) {

                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(0) Resultado(s)'),
                    ]),
                ]

            } else if (DataProviderHM.data.length > 10) {

                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(' + DataProviderHM.data.length + ') Resultado(s) '),
                    ]),
                    m('div.d-flex.w-100.text-center.mt-5', [
                        m("div.w-50.w-20", [


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderHM.rowBack(); }
                            },
                                " << Anterior "
                            ),
                        ]),

                        m("div.w-50.w-20", [

                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderHM.rowFwd(); }
                            },
                                " Siguiente >>"
                            ),



                        ])
                    ]),
                    m('div.d-flex.w-100.text-center.mt-5', [
                        m("div.w-50.w-20", [
                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderHM.firstPage(); }
                            },
                                " | Inicio "
                            ),

                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderHM.prevPage(); }
                            },
                                " < Pág. Ant. "
                            ),

                        ]),

                        m("div.w-50.w-20", [


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderHM.nextPage(); }
                            },
                                " Pág. Sig. > "
                            ),


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProviderHM.lastPage(); }
                            },
                                " Fin | "
                            ),

                        ])
                    ])

                ]

            } else {
                return [
                    m("div.text-center.w-100.mt-5", [
                        m('span', '(' + DataProviderHM.data.length + ') Resultado(s) '),
                    ]),
                ]


            }
        }


    }
};


class DataProvider {
    static data = [];
    static filteredData = [];
    static searchField = "";
    static show = "";
    static loader = false;
    static fetch() {
        DataProvider.data = [];
        DataProvider.loader = true;
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/mis-facturas-pendientes?typeFilter=" + dataViewSeguros.typeFilter,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                FacturasPendientes.codMedico = result.codMedico;
                DataProvider.loader = false;
                DataProvider.data = result.data;
                if (DataProvider.data.length !== 0) {
                    document.querySelector('#paciente').click();
                }
                DataProvider.filterData();
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
    static count = 10;
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

class dataViewSeguros {
    static show = "";
    static typeFilter = 1;
    static plFechaTransaccion = "";
    static plNumeroTransaccion = "";
    oninit = DataProvider.loadData;
    static downloadPlanilla() {
        window.location = 'https://api.hospitalmetropolitano.org/h2/v0/controlador/descarga_documentos/preparar_planilla_pago.php?proveedor=' + FacturasPendientes.codMedico + '&fecha_transaccion=' + dataViewSeguros.plFechaTransaccion + '&numero_transaccion=' + dataViewSeguros.plNumeroTransaccion + '&tipo_imprime=PAGOS';
    }
    view() {

        if (DataProvider.loader) {
            return m(Loader, { loaderMisPtes: true })
        } else {
            return m('table.w-100.mt-5.' + dataViewSeguros.show, [
                m('tbody', DataProvider.filteredData.map(function (d) {
                    return [
                        m("div.bg-white.pt-4.pl-4.pb-4.pr-4.info-box.m-mb-30.radius-5", {
                            "style": { "border-color": "#0aa1eb" }
                        }, [
                            m("h4.mb-0", [
                                m("i.icofont-bank.mr-1"),
                                'N° de Prefactura: ' + d['PREFACTURA']
                            ]

                            ),
                            m("div.media.",
                                m("div.media-body", [


                                    m("h6.mt-2",
                                        "Fecha: " + d['FECHA']
                                    ),
                                    m("h6.mt-2",
                                        "N° Factura: " + d['FACTURA']
                                    ),
                                    m("h6",
                                        "NHC: " + d['HISTORIA_CLINICA']
                                    ),
                                    m("h6",
                                        "Paciente: " + d['PACIENTE']
                                    ),
                                    m("h6",
                                        "Monto: " + d['MONTO']
                                    ),
                                    m("h6",
                                        "Saldo: " + d['SALDO']
                                    ),

                                    m("h6",
                                        "Cliente: " + d['CLIENTE']
                                    ),


                                ])
                            )
                        ]),

                    ]
                }))
            ]);
        }



    }
};


class pageToolSeguros {
    view() {

        if (DataProvider.data !== undefined && dataViewSeguros.show == "") {
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
                    m('div.d-flex.w-100.text-center.mt-5', [
                        m("div.w-50.w-20", [


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProvider.rowBack(); }
                            },
                                " << Anterior "
                            ),
                        ]),

                        m("div.w-50.w-20", [

                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProvider.rowFwd(); }
                            },
                                " Siguiente >>"
                            ),



                        ])
                    ]),
                    m('div.d-flex.w-100.text-center.mt-5', [
                        m("div.w-50.w-20", [
                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProvider.firstPage(); }
                            },
                                " | Inicio "
                            ),

                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProvider.prevPage(); }
                            },
                                " < Pág. Ant. "
                            ),

                        ]),

                        m("div.w-50.w-20", [


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProvider.nextPage(); }
                            },
                                " Pág. Sig. > "
                            ),


                            m("btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2.mr-2", {
                                type: "button",
                                "style": { "cursor": "pointer" },

                                onclick: function () { DataProvider.lastPage(); }
                            },
                                " Fin | "
                            ),

                        ])
                    ])

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


class FacturasPendientes extends App {
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
        this._setTitle = "Mis Facturas Pendientes";
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
                                    "Mis Facturas Pendientes "
                                ),
                                (DataProvider.loader ? m("span.icon-section-wave.d-inline-block.text-active.section-wave.mt-3.active") : "")
                            ])
                        )
                    ),
                    m("div.row.m-mt-30.m-mb-20",

                        m("div.col-md-12", [
                            m("div.d-flex.align-items-left.position-relative.justify-content-left", [
                                m("div.custom-control.custom-radio.m-mb-20.mr-2.fz-20", {
                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='paciente'][name='typeFilter'][value='1']", {
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                dataViewSeguros.typeFilter = 1;
                                                dataViewSeguros.show = "";
                                                dataViewHM.show = "d-none";
                                                dataViewPublicas.show = "d-none";

                                            }
                                        },


                                    }),
                                    m("label.custom-control-label[for='paciente']",
                                        "Seguros"
                                    )
                                ]),
                                m("div.custom-control.custom-radio.m-mb-20.ml-2.mr-2", {
                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='hm'][name='typeFilter'][value='2']", {
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                dataViewHM.typeFilter = 2;
                                                dataViewSeguros.show = "d-none";
                                                dataViewHM.show = "";
                                                dataViewPublicas.show = "d-none";

                                            }
                                        },

                                    }),
                                    m("label.custom-control-label[for='hm']",
                                        "Hospital Metropolitano"
                                    )
                                ]),
                                m("div.custom-control.custom-radio.m-mb-20.ml-2.mr-2", {
                                    "style": {
                                        "font-size": "large"
                                    }
                                }, [
                                    m("input.custom-control-input[type='radio'][id='publicas'][name='typeFilter'][value='3']", {
                                        onclick: (e) => {
                                            if (e.target.checked) {
                                                dataViewPublicas.typeFilter = 3;
                                                dataViewSeguros.show = "d-none";
                                                dataViewHM.show = "d-none";
                                                dataViewPublicas.show = "";
                                            }
                                        },

                                    }),
                                    m("label.custom-control-label[for='publicas']",
                                        "Instituciones Públicas"
                                    )
                                ]),


                            ]),

                        ]),

                    ),
                    m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                        m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                            m(dataViewSeguros),
                            m(pageToolSeguros),
                            m(dataViewHM),
                            m(pageToolHM),
                            m(dataViewPublicas),
                            m(pageToolPublicas),

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

export default FacturasPendientes;