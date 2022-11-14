import HeaderPublic from '../layout/header-public';
import App from '../app';
import m from 'mithril';
import Loader from '../loader';
import printJS from 'print-js';
import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';


class VisorRis {
    static show = "";
    static url = "";
    view() {


        document.cookie = "cookieName=; Path=/; domain=https://imagen.hmetro.med.ec; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        VisorRis.url = "https://imagen.hmetro.med.ec/zfp?Lights=on&mode=proxy#view&pid=" + ResultadoPacientePrivate.nhc + "&un=WEBAPI&pw=lEcfvZxzlXTsfimMMonmVZZ15IqsgEcdV%2forI8EUrLY%3d";

        return [
            m("div", [
                m("iframe", {
                    src: VisorRis.url,
                    "style": {
                        "frameborder": "0",
                        "width": "100%",
                        "height": "85vh"
                    }
                })
            ]),
            m("div.button-menu-left-copy.mt-10", { "style": { "display": "flex" } },
                m("div", [


                    m("img.p-1.mt-10[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='150rem']"),

                    m(".",
                        m("i.icofont-file-image.mr-2"),
                        "Visor de Resultados"
                    ),
                    m("h6.text-light-dark.ff-roboto",
                        "Hospital Metropolitano"
                    ),

                ]),
            ),

            m("div.button-menu-right-plus", { "style": { "display": "flex" } },
                m("button.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[type='button']", {
                    onclick: () => {
                        VisorRis.show = "";
                    },
                }, [
                    m("i.icofont-close"),
                    " Cerrar "
                ])
            ),

        ]
    }

};

class Imagen {
    static data = [];
    static detalle = [];
    static error = "";
    static showResultados = "d-none";
    static showButtons = "";
    static loader = false;
    static verResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        m.request({
            method: "GET",
            url: url,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Imagen.loader = false;
                if (result.status !== undefined && result.status) {
                    verDocPDFImg.loadDcoumentImagen(result.url);
                } else {
                    Imagen.error = "Resultado no disponible. Ingrese a 'Ver Exámenes' para más información.";
                    setTimeout(function () { Imagen.error = ""; }, 5000);
                }

            })
            .catch(function (e) {
                alert("Resultado no disponible.");
                Imagen.loader = false;
                verDocPDFImg.show = "";
                Imagen.error = "";
            });

    }
    static imprimirResultado(url) {
        m.request({
            method: "GET",
            url: url,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Imagen.loader = false;

                if (result.status !== undefined && result.status) {
                    printJS({
                        printable: result.url,
                        type: 'pdf',

                    })
                } else {
                    Imagen.error = "Resultado no disponible.";
                    setTimeout(function () { Imagen.error = ""; }, 5000);
                }


            }).catch(function (e) {
                alert("Resultado no disponible.");
                Imagen.loader = false;
                Imagen.error = "";
            });

    }
    static descargarResultado(url) {
        window.open(url)
    }
    fetch() {
        Imagen.data = [];
        Imagen.error = "";
        Imagen.loader = true;
        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultados-img/" + ResultadoPacientePrivate.nhc,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Imagen.loader = false;

                if (result.status && result.data.length !== 0) {
                    Imagen.data = result.data;
                } else {
                    Imagen.error = result.message;
                }
            })
            .catch(function (e) {
                Imagen.loader = false;
                Imagen.fetch();
            })
    }
    oninit() {
        this.fetch();
    }

    view() {

        return (Imagen.error && !Imagen.loader) ? [
            m(".tab-pane.fade.mt-5[id='v-pills-imagen'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-file-image.mr-2"),
                    "Resultados de Imagen:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m(".alert.alert-danger[role='alert']",
                    Imagen.error
                )
            ]),
        ] : (Imagen.data.length !== 0 && !Imagen.loader) ? [
            m(".tab-pane.fade." + verDocPDFImg.tab + "[id='v-pills-imagen'][role='tabpanel']", {
                class: (verDocPDFImg.show.length == 0) ? "mt-5" : "mt-0",
            }, [
                [(verDocPDFImg.show.length == 0) ? [] : [
                    m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']")
                ]],
                m("h4.m-text-2.",
                    m("i.icofont-file-image.mr-2"), [(verDocPDFImg.show.length == 0) ? "Resultados de Imagen:" : "Visor de Resultados:"]

                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),

                m("h6.mb-5." + verDocPDFImg.show, [
                    "Resultados disponibles desde Enero, 2019.",


                ]),

                m("div." + Imagen.showButtons + ".row.p-1",
                    m("div.col-md-12",
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50.", {
                            onclick: () => {
                                VisorRis.show = "d-none";
                            },
                            "style": { "cursor": "pointer" }
                        },
                            m("h4.text-dark2.mb-3.position-relative.pt-2", [
                                "Ver Exámenes (Zero FootPrint GE) ",
                            ])
                        )
                    ),
                    m("div.col-md-12",
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50.", {
                            onclick: () => {
                                Imagen.showResultados = "";
                                Imagen.showButtons = "d-none";
                                MenuBoton.update = "RX";
                            },
                            "style": { "cursor": "pointer" }
                        },
                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                "Ver Informes"
                            )
                        )
                    )
                ),
                m("div." + Imagen.showResultados + ".row.p-1",


                    m("div.table-content.col-12.pd-r-0.pd-l-0.pd-b-20." + verDocPDFImg.show,
                        m("div.text-right", [
                            m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                onclick: () => {
                                    Imagen.showResultados = "d-none";
                                    Imagen.showButtons = "";

                                },
                                "style": { "cursor": "pointer" }
                            }, [
                                "<< Regresar"


                            ]),



                        ]),
                        m("table.table.table-sm.mt-2[width='100%']", { "style": { "width": "100%", "border-color": "transparent", "margin-bottom": "50px" } }, [
                            m("tbody", [
                                Imagen.data.map(function (_v, _i, _contentData) {

                                    var _fechaHoy = moment(new Date()).format("DD-MM-YYYY");

                                    return [
                                        m("tr[role='row']", { "style": { "background-color": "transparent" } },
                                            m("td", { "style": { "border-color": "transparent", "padding": "0px" } },
                                                m("div.row.bg-white.radius-5.p-2.article-tags", [
                                                    m("div.col-12.p-0.text-right", [
                                                        m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                            title: " Ver Resultado ",
                                                            onclick: () => {
                                                                Imagen.loader = true;
                                                                verDocPDFImg.show = "d-none";
                                                                MenuBoton.typeDoc = 'RX';
                                                                Imagen.verResultado(_v.urlPdf);

                                                            },
                                                            "style": { "cursor": "pointer" }
                                                        }, [
                                                            m("i.icofont-eye-alt"),
                                                            " Ver "

                                                        ]),

                                                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [


                                                        ] : [
                                                            m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                                onclick: () => {
                                                                    Imagen.loader = true;
                                                                    Imagen.imprimirResultado(_v.urlPdf)
                                                                },
                                                                "style": { "cursor": "pointer" }
                                                            }, [
                                                                m("i.icofont-print"),
                                                                " Imprimir "
                                                            ])
                                                        ]),
                                                        m("a.capsul.fz-poppins.radius-pill.active", {
                                                            title: " Compartir Resultado ",
                                                            href: _v.deep_link,
                                                            target: "_blank",
                                                            style: { "cursor": "pointer" }
                                                        }, [
                                                            m("i.icofont-share"),
                                                            " Compartir "

                                                        ]),
                                                    ]),
                                                    m("div.col-lg-6.p-2", [
                                                        m("div", {
                                                            "style": {
                                                                "display": ((_fechaHoy == _v.FECHA) ? "block" : "none")
                                                            }
                                                        },
                                                            m("span", {
                                                                "style": { "color": "red" }
                                                            },
                                                                " Nuevo Resultado "
                                                            )
                                                        ),
                                                        m("span.d-block",
                                                            "Estudio: " + _v.ESTUDIO
                                                        ),
                                                        m("span.d-block",
                                                            " Fecha: " + _v.FECHA
                                                        ),
                                                    ]),


                                                ])
                                            )
                                        )
                                    ]
                                })
                            ])
                        ])
                    ),
                    m(verDocPDFImg),

                )
            ]),
        ] : [
            m(".tab-pane.fade.mt-5[id='v-pills-imagen'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-file-image.mr-2"),
                    "Resultados de Imagen:"
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

                ])
            ]
        }


    }




}

class verDocPDFImg {
    static url = "";
    static show = "";
    static numPage = 0;
    static tab = "";
    static loadDcoumentImagen(_url) {

        DetalleClinico.inZoom = "d-none";
        verDocPDFImg.url = _url;
        verDocPDFImg.show = "d-none";
        verDocPDFImg.tab = "active show";



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
                    url: verDocPDFImg.url,
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

                            verDocPDFImg.numPage = 1;
                        }
                        renderPage(pageNum);
                    }, 100);

                    if (pdfDoc.numPages > 1) {

                        verDocPDFImg.numPage = pdfDoc.numPages;
                    }
                });


        }, 900);






    }

    view() {

        if (verDocPDFImg.url.length !== 0) {



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

                ])
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
                    verDocPDF.loadDcoument(result.url);

                } else {
                    Laboratorio.error = "Resultado no disponible.";
                    setTimeout(function () { Laboratorio.error = ""; }, 5000);
                }

            })
            .catch(function (e) {
                alert("Resultado no disponible.");
                Laboratorio.loader = false;
                verDocPDF.show = "";
                Laboratorio.error = "";
            });

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
    fetch() {
        Laboratorio.data = [];
        Laboratorio.error = "";
        verDocPDF.url = "";

        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultados-laboratorio/" + ResultadoPacientePrivate.nhc,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                if (result.status && result.data.length !== 0) {
                    Laboratorio.data = result.data;
                } else {
                    Laboratorio.error = result.message;
                }

            })
            .catch(function (e) {
                Laboratorio.fetch();
            })
    }
    oninit() {
        this.fetch();
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
            m(".tab-pane.fade." + verDocPDF.tab + "[id='v-pills-lab'][role='tabpanel']", {
                class: (verDocPDF.show.length == 0) ? "mt-0" : "mt-5",
                class: (Laboratorio.data.length !== 0) ? "active show" : ""

            }, [
                [(verDocPDF.show.length == 0) ? [] : [
                    m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']")
                ]],
                m("h4.m-text-2",
                    m("i.icofont-laboratory.mr-2"), [(verDocPDF.show.length == 0) ? "Resultados de Laboratorio:" : "Visor de Resultados:"]

                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),

                m("h6.mb-5." + verDocPDF.show, [
                    "Resultados disponibles desde Enero, 2019.",


                ]),

                m("div.row.p-1",
                    m("div.table-content.col-12.pd-r-0.pd-l-0.pd-b-20.w-100." + verDocPDF.show,
                        m("table.table.table-sm", { "style": { "width": "100%", "border-color": "transparent", "margin-bottom": "50px" } }, [
                            m("tbody", [
                                Laboratorio.data.map(function (_v, _i, _contentData) {


                                    var _fechaHoy = moment(new Date()).format("DD-MM-YYYY");

                                    return [
                                        m("tr[role='row']", { "style": { "background-color": "transparent" } },
                                            m("td", { "style": { "border-color": "transparent", "padding": "0px" } },
                                                m("div.row.bg-white.radius-5.p-2.article-tags", [
                                                    m("div.col-12.p-0.text-right", [
                                                        [
                                                            ((Number(_v.ID_STUDIO) > 22000000) ? [
                                                                m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                                    title: " Status Pedido ",
                                                                    onclick: () => {
                                                                        window.open("https://plus.metrovirtual.hospitalmetropolitano.org/laboratorio/pedido/" + Number(_v.ID_STUDIO))

                                                                    },
                                                                    "style": { "cursor": "pointer" }
                                                                }, [
                                                                    m("i.icofont-ui-timer"),
                                                                    " Status "

                                                                ])
                                                            ] : [])
                                                        ],
                                                        m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                            title: " Ver Resultado ",
                                                            onclick: () => {
                                                                Laboratorio.loader = true;
                                                                verDocPDF.show = "d-none";
                                                                MenuBoton.typeDoc = 'LAB';

                                                                Laboratorio.verResultado(_v.urlPdf);

                                                            },
                                                            "style": { "cursor": "pointer" }
                                                        }, [
                                                            m("i.icofont-eye-alt"),
                                                            " Ver "

                                                        ]),
                                                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                                                        ] : [
                                                            m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                                title: " Imprimir Resultado ",

                                                                onclick: () => {
                                                                    Laboratorio.loader = true;
                                                                    Laboratorio.imprimirResultado(_v.urlPdf);
                                                                },
                                                                "style": { "cursor": "pointer" }
                                                            }, [
                                                                m("i.icofont-print"),
                                                                " Imprimir "

                                                            ])
                                                        ]),
                                                        m("a.capsul.fz-poppins.radius-pill.active", {
                                                            title: " Compartir Resultado ",
                                                            href: _v.deep_link,
                                                            target: "_blank",
                                                            style: { "cursor": "pointer" }
                                                        }, [
                                                            m("i.icofont-share"),
                                                            " Compartir "

                                                        ]),
                                                    ]),
                                                    m("div.col-12.p-2", [
                                                        m("div", {
                                                            "style": {
                                                                "display": ((_fechaHoy == _v.FECHA_REGISTRADO) ? "block" : "none")
                                                            }
                                                        },
                                                            m("span", {
                                                                "style": { "color": "red" }
                                                            },
                                                                " Nuevo Resultado "
                                                            )
                                                        ),
                                                        m("span.d-block",
                                                            "Origen: " + _v.ORIGEN + " Médico: " + _v.MEDICO.replaceAll(":", "")
                                                        ),
                                                        m("span.d-block",
                                                            " Fecha y Hora: " + _v.FECHA
                                                        ),
                                                    ]),

                                                ])
                                            )
                                        )
                                    ]
                                })
                            ])
                        ])
                    ),
                    m(verDocPDF),
                )
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

                if (verDocPDF.numPage == 0) {
                    return [
                        m("div.button-menu-right-plus", { "style": { "display": "flex" } },
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "d-none";
                                    MenuBoton.close = "";
                                    MenuBoton.zoomin = "";
                                    MenuBoton.zoomout = "";
                                    MenuBoton.reload = "";

                                },
                            },
                                m("i.icofont-plus", { "style": { "font-size": "x-large" } })
                            )
                        ),

                    ]
                } else if (verDocPDF.numPage == 1) {
                    return [
                        m("div.button-menu-right-plus", { "style": { "display": "flex" } },
                            m("div.text-primary.mr-2", "Descargar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDF.url)


                                },
                            },
                                m("i.icofont-download", { "style": { "font-size": "x-large" } })
                            )
                        ),

                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                            m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        verDocPDF.show = "";
                                        verDocPDF.url = "";
                                        verDocPDF.numPage = 0;
                                        verDocPDF.tab = "active show";
                                        DetalleClinico.inZoom = "";

                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
                        ] : [
                            m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
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
                            m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        verDocPDF.show = "";
                                        verDocPDF.numPage = 0;
                                        verDocPDF.url = "";
                                        verDocPDF.tab = "active show";
                                        DetalleClinico.inZoom = "";



                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
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

                            m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        verDocPDF.show = "";
                                        verDocPDF.url = "";
                                        verDocPDF.numPage = 0;
                                        verDocPDF.tab = "active show";
                                        DetalleClinico.inZoom = "";

                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
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
                            m("div.button-menu-right-zoomout", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        verDocPDF.show = "";
                                        verDocPDF.numPage = 0;
                                        verDocPDF.url = "";
                                        verDocPDF.tab = "active show";
                                        DetalleClinico.inZoom = "";



                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
                        ]),




                    ]
                } else {
                    return [
                        m("div.button-menu-right-close", { "style": { "display": "flex" } }, [
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                                m("i.icofont-close", { "style": { "font-size": "x-large" } })
                            )

                        ]

                        ),
                        m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Actualizar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                    verDocPDF.show = "";
                                    verDocPDF.tab = "active show";
                                    MenuBoton.setComand();


                                },
                            },
                                m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                            )
                        ]

                        ),
                        m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Aumentar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    DetalleClinico.inZoom = "d-none";
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                                m("i.icofont-ui-zoom-in", { "style": { "font-size": "x-large" } })
                            )
                        ]

                        ),
                        m("div.button-menu-right-zoomout", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Disminuir"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    DetalleClinico.inZoom = "";
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                                m("i.icofont-ui-zoom-out", { "style": { "font-size": "x-large" } })
                            )

                        ]

                        )

                    ]
                }

            } else {

                if (verDocPDFImg.numPage == 0) {
                    return [
                        m("div.button-menu-right-plus", { "style": { "display": "flex" } },
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "d-none";
                                    MenuBoton.close = "";
                                    MenuBoton.zoomin = "";
                                    MenuBoton.zoomout = "";
                                    MenuBoton.reload = "";

                                },
                            },
                                m("i.icofont-plus", { "style": { "font-size": "x-large" } })
                            )
                        ),
                    ]
                } else if (verDocPDFImg.numPage == 1) {
                    return [
                        m("div.button-menu-right-plus", { "style": { "display": "flex" } },
                            m("a.next.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();


                                },
                            },
                                m("i.fas.fa-chevron-circle-right"),
                                " Siguiente "

                            )
                        ),
                        m("div.button-menu-left-plus", { "style": { "display": "flex" } },
                            m("a.prev.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();


                                },
                            },
                                m("i.fas.fa-chevron-circle-left"),
                                " Anterior "

                            )
                        ),
                        m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Descargar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDFImg.url)


                                },
                            },
                                m("i.icofont-download", { "style": { "font-size": "x-large" } })
                            )
                        ]),
                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                            m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();


                                        verDocPDFImg.show = "";
                                        verDocPDFImg.url = "";
                                        verDocPDFImg.numPage = 0;
                                        verDocPDFImg.tab = "active show";
                                        DetalleClinico.inZoom = "";
                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
                        ] : [
                            m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Imprimir"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        printJS({
                                            printable: verDocPDFImg.url,
                                            type: 'pdf',

                                        })

                                    },
                                },
                                    m("i.icofont-print", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-zoomout", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();



                                        verDocPDFImg.show = "";
                                        verDocPDFImg.numPage = 0;
                                        verDocPDFImg.url = "";
                                        verDocPDFImg.tab = "active show";


                                        DetalleClinico.inZoom = "";





                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
                        ]),




                    ]
                } else if (verDocPDFImg.numPage > 1) {
                    return [
                        m("div.button-menu-right-plus", { "style": { "display": "flex" } },
                            m("a.next.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();


                                },
                            },
                                m("i.fas.fa-chevron-circle-right"),
                                " Siguiente "

                            )
                        ),
                        m("div.button-menu-left-plus", { "style": { "display": "flex" } },
                            m("a.prev.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();


                                },
                            },
                                m("i.fas.fa-chevron-circle-left"),
                                " Anterior "

                            )
                        ),
                        m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Descargar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDFImg.url)


                                },
                            },
                                m("i.icofont-download", { "style": { "font-size": "x-large" } })
                            )
                        ]),
                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                            m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();


                                        verDocPDFImg.show = "";
                                        verDocPDFImg.url = "";
                                        verDocPDFImg.numPage = 0;
                                        verDocPDFImg.tab = "active show";
                                        DetalleClinico.inZoom = "";
                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
                        ] : [
                            m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Imprimir"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        printJS({
                                            printable: verDocPDFImg.url,
                                            type: 'pdf',

                                        })

                                    },
                                },
                                    m("i.icofont-print", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-zoomout", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();



                                        verDocPDFImg.show = "";
                                        verDocPDFImg.numPage = 0;
                                        verDocPDFImg.url = "";
                                        verDocPDFImg.tab = "active show";


                                        DetalleClinico.inZoom = "";





                                    },
                                },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                            )
                        ]),




                    ]
                } else {
                    return [
                        m("div.button-menu-right-close", { "style": { "display": "flex" } }, [
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                                m("i.icofont-close", { "style": { "font-size": "x-large" } })
                            )

                        ]

                        ),
                        m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Actualizar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                    verDocPDFImg.show = "";
                                    verDocPDFImg.tab = "active show";
                                    MenuBoton.setComand();


                                },
                            },
                                m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                            )
                        ]

                        ),
                        m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Aumentar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    DetalleClinico.inZoom = "d-none";
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                                m("i.icofont-ui-zoom-in", { "style": { "font-size": "x-large" } })
                            )
                        ]

                        ),
                        m("div.button-menu-right-zoomout", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Disminuir"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    DetalleClinico.inZoom = "";
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                                m("i.icofont-ui-zoom-out", { "style": { "font-size": "x-large" } })
                            )

                        ]

                        )

                    ]
                }

            }

        } else {
            return [
                m("div.button-menu-right-close", { "style": { "display": "flex" } }, [
                    m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                        onclick: (e) => {
                            e.preventDefault();
                            MenuBoton.show = "";
                            MenuBoton.close = "d-none";
                            MenuBoton.zoomin = "d-none";
                            MenuBoton.zoomout = "d-none";
                            MenuBoton.reload = "d-none";
                        },
                    },
                        m("i.icofont-close", { "style": { "font-size": "x-large" } })
                    )

                ]

                ),
                m("div.button-menu-right-reload-pte", { "style": { "display": "flex" } }, [
                    m("div.text-primary.mr-2", "Actualizar"),
                    m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                        onclick: (e) => {
                            e.preventDefault();
                            MenuBoton.show = "";
                            MenuBoton.close = "d-none";
                            MenuBoton.zoomin = "d-none";
                            MenuBoton.zoomout = "d-none";
                            MenuBoton.reload = "d-none";
                            verDocPDFImg.show = "";
                            MenuBoton.setComand();


                        },
                    },
                        m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                    )
                ]

                ),
                m("div.button-menu-right-zoomin", { "style": { "display": "flex" } }, [
                    m("div.text-primary.mr-2", "Aumentar"),
                    m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                        onclick: (e) => {
                            e.preventDefault();
                            DetalleClinico.inZoom = "d-none";
                            MenuBoton.show = "";
                            MenuBoton.close = "d-none";
                            MenuBoton.zoomin = "d-none";
                            MenuBoton.zoomout = "d-none";
                            MenuBoton.reload = "d-none";
                        },
                    },
                        m("i.icofont-ui-zoom-in", { "style": { "font-size": "x-large" } })
                    )
                ]

                ),
                m("div.button-menu-right-zoomout", { "style": { "display": "flex" } }, [
                    m("div.text-primary.mr-2", "Disminuir"),
                    m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                        onclick: (e) => {
                            e.preventDefault();
                            DetalleClinico.inZoom = "";
                            MenuBoton.show = "";
                            MenuBoton.close = "d-none";
                            MenuBoton.zoomin = "d-none";
                            MenuBoton.zoomout = "d-none";
                            MenuBoton.reload = "d-none";
                        },
                    },
                        m("i.icofont-ui-zoom-out", { "style": { "font-size": "x-large" } })
                    )

                ]

                )

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
        MenuBoton.update = "LAB";
        this.inZoom = '';
        this.fetch();
    }

    fetch() {
        DetalleClinico.data = [];
        DetalleClinico.error = "";
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/pacientes/buscar-paciente",
            body: {
                tipoBusqueda: "nhc",
                pte: ResultadoPacientePrivate.nhc
            },
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                console.clear();
                if (result === null) {
                    DetalleClinico.fetch();
                } else {

                    if (result.status) {
                        DetalleClinico.data = result.data[0];
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
                class: ((verDocPDF.show.length == 0) ? ((verDocPDFImg.show.length == 0) ? "m-bg-1" : "") : ""),
            }, [
                m("div.intro-overlay.position-absolute.set-bg." + DetalleClinico.inZoom, {

                    "style": {
                        "background-position": "center center",
                        "background-size": "cover",
                        "background-repeat": "no-repeat",
                        "background-image": 'url(\"/assets/images/intro-bg.jpg\")',
                    }
                }),
                m("div.overlay." + DetalleClinico.inZoom),
                m("div.container", {
                    class: (DetalleClinico.inZoom.length === 0) ? "" : "bg-white",
                    style: {
                        "height": "2500px"
                    }
                },
                    m("div.row", [
                        m("div.col-md-4", {
                            class: (DetalleClinico.inZoom.length !== 0) ? "d-none" : ""
                        },
                            m("div.department-tab-pill.m-pt-140.m-pb-140.position-relative.", [
                                m("i.icofont-prescription.text-white.fz-40", { "style": { "margin-left": "-5px" } }),
                                m("h2.text-white.pb-md-5", [
                                    DetalleClinico.data.APELLIDOS + " " + DetalleClinico.data.NOMBRES
                                ]),
                                m("h6.ml12.text-white.text-uppercase.fadeInDown-slide.animated",
                                    "NHC: " + DetalleClinico.data.PK_NHCL
                                ),

                                m(".nav.pt-md-0.flex-column.nav-pills[id='v-pills-tab'][role='tablist'][aria-orientation='vertical']", [
                                    m("a.nav-link.active[data-toggle='pill'][href='#v-pills-lab'][role='tab']", {
                                        onclick: () => {
                                            MenuBoton.update = "LAB";
                                        },
                                    }, [
                                        m("i.icofont-laboratory"),
                                        m("span",
                                            " Laboratorio "
                                        )
                                    ]),
                                    m("a.nav-link[data-toggle='pill'][href='#v-pills-imagen'][role='tab']", {
                                        onclick: () => {
                                            MenuBoton.update = "RX";
                                        },
                                    }, [
                                        m("i.icofont-file-image"),
                                        m("span",
                                            " Imagen "
                                        )
                                    ]),
                                    m("a.nav-link[href='/inicio']", [
                                        m("i.icofont-home"),
                                        m("span",
                                            " Inicio "
                                        )
                                    ]),

                                ])
                            ])
                        ),
                        m("div", {
                            class: (DetalleClinico.inZoom.length !== 0) ? "col-md-12" : "col-md-8"
                        }, [
                            m("div.tab-content.m-pb-140.", {
                                class: (DetalleClinico.inZoom.length === 0) ? "m-pt-140" : "m-pt-40"
                            }, [

                                m(Laboratorio),
                                m(Imagen)
                            ])
                        ])
                    ]),

                ),
                m(MenuBoton)
            ])
        ] : [m(Loader, { loaderPage: true })]

    }

}

class ResultadoPacientePrivate extends App {
    static nhc = null;
    constructor() {
        super();
    }
    oninit(_data) {

        if (_data.attrs.nhc !== undefined) {
            ResultadoPacientePrivate.nhc = _data.attrs.nhc;
        } else {
            ResultadoPacientePrivate.nhc = '71248701';
        }

        this._setTitle = "Mis Resultados";


        DetalleClinico.data = [];
        Imagen.data = [];
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
    }


    view() {

        return [
            m("div." + ((VisorRis.show.length === 0) ? "" : "d-none"), [
                (DetalleClinico.inZoom.length === 0) ? m(HeaderPrivate) : "",
                m(DetalleClinico)
            ]),
            m("div." + ((VisorRis.show.length === 0) ? "d-none" : ""), [
                m(VisorRis)
            ])
        ];

    }



};

export default ResultadoPacientePrivate;