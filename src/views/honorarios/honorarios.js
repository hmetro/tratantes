import Auth from "../../models/auth";
import App from "../app";
import HeaderPrivate from "../layout/header-private";

let _modulos_ = [
    { id: 1, title: "Facturas Pagadas", icon: "coins", url: "/honorarios/facturas-pagadas" },
    { id: 2, title: "Honorarios Registrados", icon: "ui-folder", url: "/honorarios/auditados" },
    { id: 3, title: "Facturas Pendientes", icon: "doctor", url: "/honorarios/facturas-pendientes" },
    { id: 4, title: "Transferencias Realizadas", icon: "doctor", url: "/honorarios/transferencias" },
    { id: 5, title: "Estado de Cuenta", icon: "doctor", url: "/honorarios/estado-de-cuenta" },
];

class Modulos {
    view() {
        return _modulos_.map(function(i) {

            if (i.id == 1) {
                return m("div.col-sm-12.col-md-12.col-lg-6",
                    m("a", { href: i.url }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-" + i.icon + ".text-grad-1.fz-50")
                            ),
                            m("h5.text-dark2.mb-3.position-relative.pt-2",
                                i.title
                            )
                        ])
                    ])
                )
            }

            if (i.id == 2) {
                return m("div.col-sm-12.col-md-12.col-lg-6.d-none",
                    m("a", {
                        href: i.url,

                    }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-" + i.icon + ".text-grad-1.fz-50")

                            ),
                            m("h5.text-dark2.mb-3.position-relative.pt-2",
                                i.title
                            )
                        ])
                    ])
                )
            }


            if (i.id == 3) {
                return m("div.col-sm-12.col-md-12.col-lg-6",
                    m("a", {
                        href: i.url,

                    }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-letter.text-grad-1.fz-50"),
                            ),
                            m("h5.text-dark2.mb-3.position-relative.pt-2",
                                i.title
                            )
                        ])
                    ])
                )
            }


            if (i.id == 4) {
                return m("div.col-sm-12.col-md-12.col-lg-6",
                    m("a", {
                        href: i.url,
                    }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-wallet.text-grad-1.fz-50"),
                            ),
                            m("h5.text-dark2.mb-3.position-relative.pt-2",
                                i.title
                            )
                        ])
                    ])
                )
            }


            if (i.id == 5) {
                return m("div.col-sm-12.col-md-12.col-lg-6",
                    m("a", {
                        href: i.url,
                    }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-wallet.text-grad-1.fz-50"),
                            ),
                            m("h5.text-dark2.mb-3.position-relative.pt-2",
                                i.title
                            )
                        ])
                    ])
                )
            }





        })
    }
}

class Honorarios extends App {
    constructor() {
        super();
    }
    oninit() {
        this._setTitle = "Mis Honorarios";

        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
    }
    view() {
        return [
            m(HeaderPrivate),
            m("section.m-bg-1",
                m("div.container",
                    m("div.row",
                        m("div.col-md-6.offset-md-3",
                            m("div.text-center.m-mt-70", [

                                m("h2.mb-5.text-dark",
                                    " Mis Honorarios "
                                ),

                            ])
                        )
                    ),
                    m("div.row.m-pt-20.m-pb-60", [
                        m(Modulos)
                    ])
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
            ),


        ];
    }

};





export default Honorarios;