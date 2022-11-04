import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';
import PageResultadoImagen from './pageResultado';
import App from '../app';

class ResultadoImagen extends App {
    constructor() {
        super();
    }

    oninit() {
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
    }

    view() {
        return [
            m(HeaderPrivate),
            m(PageResultadoImagen),
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
}



export default ResultadoImagen;