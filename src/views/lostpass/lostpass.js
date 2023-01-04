import Auth from '../../models/auth';
import HeaderPublic from '../layout/header-public';
import FooterPublic from '../layout/footer-public';
import FormLostPass from './formLost';
import App from '../app';

class LostPass extends App {
    constructor() {
        super();
    }
    oninit(data) {

        if (Auth.isLogin()) {
            return m.route.set('/inicio');
        }

        if (data.attrs.token !== undefined) {
            FormLostPass.validarTokenRecovery(data.attrs.token);
        }

    }
    oncreate() {
        this.mainLayout();
    }

    view() {
        return [
            m(HeaderPublic),
            m(FormLostPass),
            m(FooterPublic)
        ];
    }
};

export default LostPass;