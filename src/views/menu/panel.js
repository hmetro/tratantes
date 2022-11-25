var _modulos_ = [
    { id: 1, title: "Mis Pacientes", icon: "doctor", url: "/pacientes" },
    { id: 2, title: "Resultados de Imagen y Laboratorio", icon: "doctor", url: "/resultados" },
    { id: 3, title: "Biblioteca de Credenciales", icon: "addres-book", url: "" },
    { id: 4, title: "Mis Honorarios", icon: "addres-book", url: "" },


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
                    m("a", {
                        href: "https://appdocumentosdirmed.azurewebsites.net/DM/Login/Auth2Factor/" + localStorage.appUser + "/" + localStorage.accessToken,
                        target: "_blank"

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

            if (i.id == 4) {
                return m("div.col-sm-12.col-md-12.col-lg-6",
                    m("a", {
                        href: "https://appdocumentosdirmed.azurewebsites.net/DM/Login/Auth2Factor/" + localStorage.appUser + "/" + localStorage.accessToken,
                        target: "_blank"

                    }, [
                        m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50", [
                            m("div.service-circle.position-relative.mb-4.text-active.m-bg-4.rounded-circle.d-flex.align-items-center.justify-content-center",
                                m("span.icofont-credit-card.text-grad-1.fz-50"),
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
                    ])
                )
            ),

        ];
    }

};





export default MenuPanel;