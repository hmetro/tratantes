import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';
import App from '../app';
import Loader from '../loader';



const DataProvider = {
    data: [],
    filteredData: [],
    searchField: "",
    show: "",
    fetch: () => {



        DataProvider.data = [];
        Loader.show = "";
        Loader.buttonShow = "";
        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultados/imagen",
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Loader.show = "d-none";
                Loader.buttonShow = "d-none";
                DataProvider.data = result.data;
                DataProvider.filterData();


            })
            .catch(function (e) {
                DataProvider.fetch();
            })




    },
    loadData: function () {
        DataProvider.fetch();
    },
    filterData: function () {
        var to = Math.min(DataProvider.from + DataProvider.count, DataProvider.data.length + 1);
        DataProvider.filteredData = [];
        for (var i = DataProvider.from - 1; i < to - 1; i++) {
            DataProvider.filteredData.push(DataProvider.data[i]);
        }
    },
    from: 1,
    count: 10,
    setFrom: function (from) {
        DataProvider.from = parseInt(from);
        DataProvider.filterData();
    },
    setCount: function (count) {
        DataProvider.count = parseInt(count);
        DataProvider.filterData();
    },
    nextPage: function () {
        var from = DataProvider.from + DataProvider.count;
        if (from > DataProvider.data.length)
            return;
        DataProvider.from = from;
        DataProvider.filterData();
    },
    lastPage: function () {
        DataProvider.from = DataProvider.data.length - DataProvider.count + 1;
        DataProvider.filterData();
    },
    prevPage: function () {
        DataProvider.from = Math.max(1, DataProvider.from - DataProvider.count);
        DataProvider.filterData();
    },
    firstPage: function () {
        DataProvider.from = 1;
        DataProvider.filterData();
    },
    rowBack: function () {
        DataProvider.from = Math.max(1, DataProvider.from - 1);
        DataProvider.filterData();
    },
    rowFwd: function () {
        if (DataProvider.from + DataProvider.count - 1 >= DataProvider.data.length)
            return;
        DataProvider.from += 1;
        DataProvider.filterData();
    }
};

const dataView = {
    show: "",
    oninit: DataProvider.loadData,
    view: () => {
        return m('table.w-100.mt-5.' + dataView.show, [
            m('tbody', DataProvider.filteredData.map(function (d) {
                return [
                    m("div.bg-white.pt-4.pl-4.pb-4.pr-4.info-box.m-mb-30.radius-5", {
                        "style": { "border-color": "#0aa1eb" }
                    },
                        [
                            m("h4.mb-0", [
                                m("i.icofont-file-document.mr-2"),
                                d['ESTUDIO']
                            ]

                            ),
                            m("div.media.",
                                m("div.media-body",
                                    [
                                        m("p.designation.text-uppercase", [
                                            "FECHA: " + d['FECHA'],

                                        ]),

                                        m("h6",
                                            "MÉDICO: " + d['MEDICO'],
                                        ),

                                        m("div.text-right", [
                                            m("a.btn.medim-btn.solid-btn.mt-4.text-medium.radius-pill.text-active.text-uppercase.bg-transparent.position-relative", {
                                                href: d['URL']
                                            },
                                                " Ver Resultado "
                                            )
                                        ])

                                    ]
                                )
                            )
                        ]
                    ),

                ]
            }))
        ]);
    }
};



const pageTool = {
    view: () => {

        if (DataProvider.data !== undefined && dataView.show == "") {
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


const ButtonHelp = {
    help: false,
    view: () => {
        return [

            m("div.button-menu-right-reload", {
                "style": { "display": "flex" },
                class: (Loader.buttonShow == 'd-none' ? '' : 'd-none'),
            },
                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                    onclick: (e) => {
                        e.preventDefault();
                        ButtonHelp.help = !ButtonHelp.help;
                    },
                },
                    m("i.icofont-question", { "style": { "font-size": "x-large" } })
                )
            )
        ];

    },
};



class PageResultadosImagen {
    codMedico = "";
    oninit() {
        this.codMedico = Auth.codMedico;
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
        DataProvider.loadData();

    }




    view() {
        if (DataProvider.data.length !== 0) {
            return [
                m("section.m-bg-1",
                    m("div.container", {
                        class: (!ButtonHelp.help ? '' : 'd-none')
                    },
                        m("div.row",
                            m("div.col-md-6.offset-md-3",
                                m("div.text-center.m-mt-70", [
                                    m("h2.m-0.text-dark",
                                        "Resultados de Imagen "
                                    ),
                                    m("span.icon-section-wave.d-inline-block.text-active.section-wave.mt-3.active")
                                ])
                            )
                        ),

                        m("div.row.m-pt-20.m-pb-60.m-mt-20", {
                            class: (!ButtonHelp.help ? '' : 'd-none')
                        }, [
                            m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                                m(dataView),
                                m(pageTool),
                            ),

                        ]),

                    ),
                    m("div.container", {
                        class: (ButtonHelp.help ? '' : 'd-none')
                    },
                        m("div.row",
                            m("div.col-md-6.offset-md-3",
                                m("div.text-center.m-mt-70", [
                                    m("h2.m-0.text-dark",
                                        "Ayuda"
                                    ),
                                    m("span.d-inline-block.text-active.mt-3.active", 'Soporte Metrovirtual: ¡Estamos aquí, para lo que necesites!.')
                                ])
                            )
                        ),


                        m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                            m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                                m("div.row.m-mb-60.m-mt-10.", [
                                    m("div.col-12",
                                        m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                            m("span.position-absolute.flaot-icon",
                                                m("i.icofont-stethoscope-alt.text-active")
                                            ),
                                            m("h5.m-text-2.mb-3",
                                                m("p.designation", [
                                                    " ¿No encuentro mi resultado? ",
                                                ]),
                                            ),

                                        ]),
                                        m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                            m("span.position-absolute.flaot-icon",
                                                m("i.icofont-stethoscope-alt.text-active")
                                            ),
                                            m("h5.m-text-2.mb-3",
                                                m("p.designation.", [
                                                    " Necesito un resultado anterior al 2019",
                                                ]),
                                            ),

                                        ]),
                                        m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                            m("span.position-absolute.flaot-icon",
                                                m("i.icofont-stethoscope-alt.text-active")
                                            ),
                                            m("h5.m-text-2.mb-3",
                                                m("p.designation", [
                                                    " Solicitar duplicado en físico (CD) (USB) a Domicilio. ",
                                                ]),
                                            ),

                                        ])
                                    ),


                                ]),
                                m("div.row",
                                    m("div.col-md-12.text-center.m-mb-50",
                                        m("a.btn.bordered-blue.fadeInDown-slide.animated.medim-btn.btn-bordered.mt-0.text-medium.radius-pill.bg-transparent.text-active.text-uppercase.[href='#!/salir']",
                                            " Salir "
                                        )
                                    )
                                )
                            ),

                        ])
                    )
                ),
                m(ButtonHelp),
                m("div.button-menu-center.text-center",
                    m("a.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[href='/']", [
                        m("i.icofont-home"),
                        " Inicio "
                    ])
                )

            ];
        } else {
            return [

                m("div.preloader-inner.mt-5",
                    m("div.loader-content.mt-5",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-5.",),
                    )
                ),
            ];
        }

    }

};


class ResultadosImagen extends App {
    constructor() {
        super();
    }
    oninit() {
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
        this._setTitle = "Resultados de Imagen";

        this.view = this._p;
        submitBusqueda();

    }

    _l() {
        return [
            m(Loader, { loaderPage: true }),
        ];
    }

    _p() {
        return [
            m(HeaderPrivate),
            m(PageResultadosImagen),
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
            ])
        ];
    }

    view() {

    }
}


function submitBusqueda() {
    document.onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == "13") {
            console.log('OK');
        }
    };
}


export default ResultadosImagen;