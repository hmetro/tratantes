import App from '../app';
import m from 'mithril';
import Loader from '../loader';
import printJS from 'print-js';
import Auth from '../../models/auth';

class ButtonHelp {
    static help = false;
};

class ButtonShare {
    static help = false;
};


class verDocPDF {
    static url = "";
    static show = "";
    static numPage = 0;
    static tab = "";
    static loadDcoument(_url) {

        DetalleClinico.inZoom = "d-none";
        verDocPDF.url = _url;
        verDocPDF.show = "d-none";
        verDocPDF.tab = "active show";

        var canvas = document.getElementById("render-pdf");

        setTimeout(function () {



            $(".doc-loader").show();
            $(".doc-content").hide();
            $(".doc-control").hide();





            // If absolute URL from the remote server is provided, configure the CORS
            // Loaded via <script> tag, create shortcut to access PDF.js exports.
            var pdfjsLib = window["pdfjs-dist/build/pdf"];
            // The workerSrc property shall be specified.
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "assets/dashforge/lib/pdf.js/build/pdf.worker.js";
            var pdfDoc = null,
                pageNum = 1,
                pageRendering = false,
                pageNumPending = null,
                scale = 1.25,
                canvas = document.getElementById("render-pdf"),
                ctx = canvas.getContext("2d")
            /**
             * Get page info from document, resize canvas accordingly, and render page.
             * @param num Page number.
             */
            function renderPage(num) {
                pageRendering = true;
                // Using promise to fetch the page
                pdfDoc.getPage(num).then(function (page) {
                    var viewport = page.getViewport({
                        scale: scale,
                    });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: ctx,
                        viewport: viewport,
                    };
                    var renderTask = page.render(renderContext);
                    // Wait for rendering to finish
                    renderTask.promise.then(function () {
                        pageRendering = false;
                        if (pageNumPending !== null) {

                            // New page rendering is pending
                            renderPage(pageNumPending);
                            pageNumPending = null;

                        } else {

                            $('.preloader').fadeOut('slow', function () {
                                $(this).hide();
                            });


                            if (!(window.matchMedia('(min-width: 992px)').matches)) {

                            } else {
                                $('#render-pdf').css("width", "100%");
                            }



                            $(".prev").click(function (e) {
                                e.preventDefault();
                                onPrevPage();
                            });

                            $(".next").click(function (e) {
                                e.preventDefault();
                                onNextPage();
                            });



                        }
                    });
                });
                // Update page counters
                // document.getElementsByClassName('page_num').textContent = num;
                $(".page_num").text(num);
            }
            /**
             * If another page rendering in progress, waits until the rendering is
             * finised. Otherwise, executes rendering immediately.
             */
            function queueRenderPage(num) {
                if (pageRendering) {
                    pageNumPending = num;
                } else {
                    renderPage(num);
                }
            }
            /**
             * Displays previous page.
             */
            function onPrevPage() {
                if (pageNum <= 1) {
                    return;
                }
                pageNum--;
                queueRenderPage(pageNum);
            }
            /*
                                                                                                                                                                                                                                                                                  document.getElementsByClassName('prev').onclick = function(e) {
                                                                                                                                                                                                                                                                                      e.preventDefault();
                                                                                                                                                                                                                                                                                      onPrevPage();
                                                                                                                                                                                                                                                                                  };
                                                                                                                                                                                                                                                                                  */
            $(".prev").click(function (e) {
                e.preventDefault();
                onPrevPage();
            });
            /**
             * Displays next page.
             */
            function onNextPage() {
                if (pageNum >= pdfDoc.numPages) {
                    return;
                }
                pageNum++;
                queueRenderPage(pageNum);
            }
            /*
                                                                                                                                                                                                                                                                                  document.getElementsByClassName('next').onclick = function(e) {
                                                                                                                                                                                                                                                                                      e.preventDefault();
                                                                                                                                                                                                                                                                                      onNextPage();
                                                                                                                                                                                                                                                                                  };
                                                                                                                                                                                                                                                                                  */
            $(".next").click(function (e) {
                e.preventDefault();
                onNextPage();
            });
            /**
             * Asynchronously downloads PDF.
             *
             */

            pdfjsLib
                .getDocument({
                    url: verDocPDF.url,
                })
                .promise.then(function (pdfDoc_) {
                    pdfDoc = pdfDoc_;
                    $(".page_count").text(pdfDoc.numPages);

                    // Initial/first page rendering
                    setTimeout(function () {
                        $(".doc-loader").hide();
                        $(".doc-content").show();
                        $(".doc-control").show();
                        if (pdfDoc.numPages == 1) {

                            verDocPDF.numPage = 1;
                        }
                        renderPage(pageNum);
                    }, 100);

                    if (pdfDoc.numPages > 1) {

                        verDocPDF.numPage = pdfDoc.numPages;
                    }
                });


        }, 900);






    }

    view() {

        if (verDocPDF.url.length !== 0) {

            return [
                m("div.col-lg-12.text-center[id='docPDF']", [
                    m("div.doc-control.row.mb-0.p-0.w-100", [

                        m("div.row.col-12.d-block.tx-14.tx-semibold", [
                            " Página: ",
                            m("span.page_num",),
                            " / ",
                            m("span.page_count",)
                        ]),

                    ]),
                    m("div.doc-loader.row.col-12", { "style": { "display": "none" } },
                        m("div..col-12.pd-5",
                            m("div.preloader-inner",
                                m("div.loader-content",
                                    m("span.icon-section-wave.d-inline-block.text-active.mt-3.",),
                                )
                            ),
                        )
                    ),
                    m("div.doc-content.row.col-12.pd-0.", { "style": { "display": "flex" } },
                        m("div.d-flex.justify-content-start.pd-0.mg-0.w-100",
                            m("canvas[id='render-pdf']", {})
                        )
                    ),

                ]),

            ]
        }


    }




}

class Laboratorio {
    static data = [];
    static detalle = [];
    static error = "";
    static showFor = "";
    static loader = false;
    static verResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Laboratorio.loader = false;
        MenuBoton.typeDoc = 'LAB';
        verDocPDF.show = "";
        verDocPDF.loadDcoument(url);
        m.redraw();
    }
    static fetchResultado(url) {
        m.request({
            method: "GET",
            url: url,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Laboratorio.loader = false;
                if (result.status !== undefined && result.status) {
                    window.open(result.url);
                } else {
                    Laboratorio.error = "Resultado no disponible.";
                    setTimeout(function () { Laboratorio.error = ""; }, 5000);
                }

            }).catch(function (e) {
                alert("Resultado no disponible.");
                Laboratorio.loader = false;
                verDocPDF.show = "";
                Laboratorio.error = "";
            });

    }
    static imprimirResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        m.request({
            method: "GET",
            url: url,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Laboratorio.loader = false;
                if (result.status !== undefined && result.status) {
                    printJS(result.url)
                } else {
                    Laboratorio.error = "Resultado no disponible.";
                    setTimeout(function () { Laboratorio.error = ""; }, 5000);
                }

            }).catch(function (e) {
                alert("Resultado no disponible.");
                Laboratorio.loader = false;
                verDocPDF.show = "";
                Laboratorio.error = "";
            });

    }

    oninit() {
        Laboratorio.data = DetalleClinico.data;
        Laboratorio.loader = true;
        Laboratorio.verResultado(DetalleClinico.data.url);

    }
    view() {



        return Laboratorio.error ? [
            m(".tab-pane.mt-5.fade.active.show[id='v-pills-lab'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-laboratory.mr-2"),
                    "Resultados de Laboratorio:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m(".alert.alert-danger[role='alert']",
                    Laboratorio.error
                )
            ]),
        ] : (Laboratorio.data.length !== 0 && !Laboratorio.loader) ? [
            m(".tab-pane.fade.active.show[id='v-pills-lab'][role='tabpanel']", {
                class: "mt-0",

            }, [
                m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),

                m("h4.m-text-2",
                    m("i.icofont-laboratory.mr-2"), "Visor de Resultados:"

                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),

                m("div", {
                    class: (ButtonHelp.help ? '' : 'd-none')
                },
                    m("div.row",
                        m("div.col-md-6.offset-md-3",
                            m("div.text-center", [
                                m("h2.m-0.text-dark",
                                    "Ayuda"
                                ),
                                m("span.d-inline-block.mt-3.active", 'Opciones disponibles')
                            ])
                        )
                    ),


                    m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                        m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                            m("div.row.m-mb-60.m-mt-10.", [
                                m("div.col-12",
                                    m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                        m("div.features-circle.mb-3.m-bg-3.text-active.d-inline-flex.align-items-center.justify-content-center.rounded-circle",
                                            m("i.icofont-page")
                                        ),
                                        m("h5.m-text-2.mb-3",
                                            m("p.designation", [
                                                " ¿Mi resultado tiene inconsitencias? ",
                                            ]),
                                        ),

                                    ]),

                                ),


                            ]),

                        ),

                    ])
                ),
                m("div", {
                    class: (ButtonShare.help ? '' : 'd-none')
                },
                    m("div.row",
                        m("div.col-md-6.offset-md-3",
                            m("div.text-center", [
                                m("h2.m-0.text-dark",
                                    "Compartir"
                                ),
                                m("span.d-inline-block.mt-3.active", 'Opciones disponibles')
                            ])
                        )
                    ),


                    m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                        m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                            m("div.row.m-mb-60.m-mt-10.", [
                                m("div.col-12",

                                    m("div", {
                                        onclick: (e) => {
                                            alert('POPOP');
                                            window.open("mailto:concas@hetro.med.ec?subject=kk&body=kk");
                                        },
                                    }, [
                                        m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                            m("div.features-circle.mb-3.m-bg-3.text-active.d-inline-flex.align-items-center.justify-content-center.rounded-circle",
                                                m("i.icofont-send-mail")
                                            ),
                                            m("h5.m-text-2.mb-3",
                                                m("p.designation", [
                                                    " Compartir por correo electrónico ",
                                                ]),
                                            ),

                                        ]),
                                    ]),

                                    m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                        m("div.features-circle.mb-3.m-bg-3.text-active.d-inline-flex.align-items-center.justify-content-center.rounded-circle",
                                            m("i.icofont-whatsapp")
                                        ),
                                        m("h5.m-text-2.mb-3",
                                            m("p.designation.", [
                                                " Compartir por Whatsapp",
                                            ]),
                                        ),

                                    ]),

                                ),


                            ]),

                        ),

                    ])
                ),
                m("div.row.p-1",

                    m(verDocPDF),
                ),
            ]),
        ] : [
            m(".tab-pane.mt-5.fade.active.show[id='v-pills-lab'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-laboratory.mr-2"),
                    "Resultados de Laboratorio:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("div.text-center", [
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",)
                    )
                ])
            ]),
        ]





    }

};

class MenuBoton {
    static show = "";
    static close = "d-none";
    static zoomin = "d-none";
    static zoomout = "d-none";
    static reload = "d-none";
    static zi = "";
    static update = "";
    static typeDoc = "LAB";
    static setComand() {

        if (MenuBoton.update == "SV") {
            SignosVitales.fetch();
        }

        if (MenuBoton.update == "EV") {
            Evoluciones.fetch();
        }

        if (MenuBoton.update == "LAB") {
            Laboratorio.fetch();
        }

        if (MenuBoton.update == "RX") {
            Imagen.fetch();
        }




    }
    onupdate(_data) {
        m.redraw();
    }

    view() {

        if (MenuBoton.show.length === 0) {

            if (MenuBoton.typeDoc == 'LAB') {

                if (verDocPDF.numPage === 1) {
                    return [

                        m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Descargar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDF.url)


                                },
                            },
                                m("i.icofont-download", { "style": { "font-size": "x-large" } })
                            )
                        ]),
                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                            m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Ayuda"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        ButtonHelp.help = !ButtonHelp.help;
                                    },
                                },
                                    m("i.icofont-question", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                        ] : [
                            m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Imprimir"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        printJS({
                                            printable: verDocPDF.url,
                                            type: 'pdf',

                                        })

                                    },
                                },
                                    m("i.icofont-print", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Compartir"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonShare.help = !ButtonShare.help;
                                    },
                                },
                                    m("i.icofont-share", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-p4", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Ayuda"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonHelp.help = !ButtonHelp.help;
                                    },
                                },
                                    m("i.icofont-question", { "style": { "font-size": "x-large" } })
                                )
                            ]),

                        ]),




                    ]
                } else if (verDocPDF.numPage > 1) {
                    return [
                        m("div.button-menu-right-plus", { "style": { "display": "flex" } },
                            m("a.next.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();


                                },
                            },
                                m("i.fas.fa-chevron-circle-right"),
                                " Pág. Sig. "

                            )
                        ),
                        m("div.button-menu-left-plus", { "style": { "display": "flex" } },
                            m("a.prev.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();


                                },
                            },
                                m("i.fas.fa-chevron-circle-left"),
                                " Pág. Ant. "

                            )
                        ),
                        m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Descargar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDF.url)


                                },
                            },
                                m("i.icofont-download", { "style": { "font-size": "x-large" } })
                            )
                        ]),
                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [


                        ] : [
                            m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Imprimir"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        printJS({
                                            printable: verDocPDF.url,
                                            type: 'pdf',

                                        })

                                    },
                                },
                                    m("i.icofont-print", { "style": { "font-size": "x-large" } })
                                )
                            ]),

                        ]),




                    ]
                } else {
                    return [
                        m("div.button-menu-right-plus", { "style": { "display": "flex" } }, [
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    window.location.reload();
                                },
                            },
                                m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                            )

                        ]

                        ),




                    ]
                }

            }

        } else {
            return [
                m("div.button-menu-right-plus", { "style": { "display": "flex" } }, [
                    m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                        onclick: (e) => {
                            e.preventDefault();
                            window.location.reload();
                        },
                    },
                        m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                    )

                ]

                ),




            ]
        }










    }
};

class DetalleClinico {
    static ver = true;
    static eliminar = false;
    static editar = false;
    static labelOperation = "Detalle:";
    static inZoom = "";
    static data = [];
    static detalle = [];
    static error = "";

    oninit() {
        this.inZoom = '';
        this.fetch();
    }

    fetch() {
        DetalleClinico.data = [];
        DetalleClinico.error = "";
        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultado/l/?id=" + VisorLab.id,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {

                if (result === null) {
                    DetalleClinico.fetch();
                } else {

                    if (result.status) {
                        DetalleClinico.data = result;

                    } else {
                        DetalleClinico.error = "No existe información disponible. La ubicación del paciente ya no es Emergencia.";
                    }
                }

            })
            .catch(function (e) {
                DetalleClinico.fetch();
            })
    }

    view() {


        return DetalleClinico.error ? [
            m('p', 'error')
        ] : (DetalleClinico.data.length !== 0) ? [
            m("section.intro-area.type-1.position-relative", {
                class: "m-bg-1",
            }, [
                m("div.container", {
                    class: "bg-white",
                    style: {
                        "height": "2500px"
                    }
                },
                    m("div.row", [

                        m("div", {
                            class: "col-md-12"
                        }, [
                            m("div.tab-content.m-pb-140.", {
                                class: "m-pt-40"
                            }, [

                                m(Laboratorio),
                            ])
                        ])
                    ]),
                    m(MenuBoton)
                ),

            ])
        ] : [m(Loader, { loaderPage: true })]

    }

}

class VisorLab extends App {
    static id = null;
    constructor() {
        super();
    }
    oninit(_data) {

        if (_data.attrs.id !== undefined) {
            VisorLab.id = _data.attrs.id;
        }

        this._setTitle = "Visor de Resultados";

        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
    }


    view() {

        return [
            m(DetalleClinico)
        ];

    }



};

export default VisorLab;