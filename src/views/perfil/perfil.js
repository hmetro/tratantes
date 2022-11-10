import Auth from '../../models/auth';
import HeaderPage from '../layout/header-page';
import PagePerfil from './page';
import App from '../app';


class MiPerfil extends App {
    constructor() {
        super();
    }
    oninit() {
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
    }
    oncreate() {
        this._setTitle = "Mi Perfil";
    }
    view() {
        return [
            m(HeaderPage),
            m(PagePerfil),
        ];
    }

};

export default MiPerfil;