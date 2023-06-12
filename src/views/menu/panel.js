import Inicio from "../inicio/inicio";

var _modulos_ = [
    { id: 1, title: "Mis Pacientes", icon: "doctor", url: "/pacientes" },
    { id: 2, title: "Resultados de Imagen y Laboratorio", icon: "doctor", url: "/resultados" },
    { id: 3, title: "Biblioteca de Credenciales", icon: "addres-book", url: "" },
    { id: 4, title: "Mis Honorarios", icon: "icofont-letter", url: "/honorarios" },
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
                return m("div.col-sm-12.col-md-12.col-lg-6",
                    m("a", {
                        href: i.url,

                    }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-patient-file.text-grad-1.fz-50"),
                                m("span.icofont-laboratory.text-grad-1.fz-50")
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
                    m(".", {
                        style: {
                            "cursor": "pointer"
                        },

                        onclick: (e) => {
                            window.location.href = "https://appdocumentosdirmed.azurewebsites.net/app/access/" + Inicio.user.data.user + "/" + localStorage.accessToken.substring(0, 15);

                        }

                    }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-address-book.text-grad-1.fz-50"),
                            ),
                            m("h5.text-dark2.mb-3.position-relative.pt-2",
                                i.title
                            )
                        ])
                    ])
                )
            }

            if (i.id == 4 && Inicio.user.data.codMedico != '0') {
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

        })
    }
}

class MenuPanel {

    view() {

        return [
            m("section.m-bg-1",
                m("div.container",
                    m("div.row",
                        m("div.col-md-6.offset-md-3",
                            m("div.text-center.m-mt-70", [

                                m("h2.mb-5.text-dark",
                                    " Inicio "
                                ),

                            ])
                        )
                    ),
                    m("div.row.m-pt-20.m-pb-60", [
                        m(Modulos)
                    ]),
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

                )
            ),

        ];
    }

};





export default MenuPanel;