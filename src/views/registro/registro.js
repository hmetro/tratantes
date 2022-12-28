import Auth from '../../models/auth';
import HeaderPublic from '../layout/header-public';
import FooterPublic from '../layout/footer-public';
import FormRegistro from './formRegistro';
import App from '../app';

class Registro extends App {
    constructor() {
        super();
    }
    oninit() {
        if (Auth.isLogin()) {
            return m.route.set('/inicio');
        }
    }
    oncreate() {
        this.mainLayout();
        Registro.submitRegistro();
    }
    static submitRegistro() {
        document.onkeypress = function(e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == "13") {
                if (Auth.canSubmit()) {
                    document.getElementsByTagName('button')[0].click();
                }
            }
        };
    }
    view() {
        return [
            m(HeaderPublic),
            m(FormRegistro),
            m(FooterPublic)
        ];
    }
};

export default Registro;