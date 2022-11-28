import m from "mithril";

const ButtonReload = {

    view: () => {
        return [

            m("div.button-menu-right-reload", { "style": { "display": "flex" } },
                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                    onclick: (e) => {
                        e.preventDefault();
                        window.location.reload();
                    },
                },
                    m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                )
            )
        ];

    },
};


class Loader {

    static show = "d-none";
    static buttonShow = "d-none";
    static loaderInicio;
    static loaderPage;
    static loaderMisPtes;

    constructor(data) {
        this.loaderInicio = data.attrs.loaderInicio;
        this.loaderPage = data.attrs.loaderPage;
        this.loaderMisPtes = data.attrs.loaderMisPtes;


    }

    oninit() {
        if (this.loaderInicio) {
            this.view = this.inicio;
        }

        if (this.loaderMisPtes) {
            this.view = this.pagePtes;
        }

        if (this.loaderPage) {
            this.view = this.page;
        }
    }

    view() {

    }
    pagePtes() {
        return [

            m("div.text-center",
                m("div.preloader-inner",
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",),
                    )
                ),

            ),
            m(ButtonReload),

        ];
    }

    page() {
        return [

            m("div.text-center", { style: { "margin-top": "14rem" } },
                m("div.preloader-inner",
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",),
                    )
                ),

            ),
            m(ButtonReload),

        ];
    }

    inicio() {
        return [

            m("div.text-center", { style: { "margin-top": "14rem" } },
                m("div.preloader-inner",
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",),
                    )
                ),

            ),
            m(ButtonReload),
        ];
    }

}




export default Loader;