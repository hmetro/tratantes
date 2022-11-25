import Auth from '../../models/auth';
import HeaderPrivate from '../layout/header-private';
import MenuPanel from '../menu/panel';
import App from '../app';
import Loader from '../loader';

class Inicio extends App {

    constructor() {
        super();
    }

    oninit() {
        if (!Auth.isLogin()) {
            return m.route.set('/auth');
        }
        this._setTitle = "Inicio";
        this.view = this._p;
        let $this = this;
        setTimeout(function() {
            $this.view = $this._p;
            m.redraw();
        }, 3000)

    }


    _p() {
        return [
            m(HeaderPrivate),
            m(MenuPanel),
        ];
    }

    _l() {
        return [
            m(Loader, { loaderInicio: true }),
        ];
    }


    view() {

    }


}


export default Inicio;