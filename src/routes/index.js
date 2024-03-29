// Pages here
import App from '../views/app'
import Salir from '../views/salir'
import Login from '../views/login/login'
import Inicio from '../views/inicio/inicio'
import Pacientes from '../views/pacientes/pacientes';
import Paciente from '../views/paciente/paciente';
import MiPerfil from '../views/perfil/perfil';
import _404 from '../views/404'
import ResultadosPacientePrivate from '../views/paciente/resultadosPrivate';
import VisorLab from '../views/visor/visorLab';
import VisorImg from '../views/visor/visorImg';
import ViewerImg from '../views/visor/viewerImg';
import ResultadoPacientes from '../views/pacientes/resultadosPacientes';
import Honorarios from '../views/honorarios/honorarios';
import FacturasPagadas from '../views/honorarios/facturasPagadas';
import FacturasPendientes from '../views/honorarios/facturasPendientes';
import EstadoCuenta from '../views/honorarios/estadocuenta';
import Transferencias from '../views/honorarios/transferencias';
import Registro from '../views/registro/registro';
import Verify from '../views/verify';
import LostPass from '../views/lostpass/lostpass';
import HonoAuditados from '../views/honorarios/honoAuditados';


// Routes here
const Routes = {
    '/': App,
    '/inicio': Inicio, //Inicio
    '/auth': Login, // Login
    '/registro': Registro, // Registro
    '/lostpass': LostPass, // LostPass
    '/pacientes': Pacientes, // Pacientes
    '/paciente/:nhc': Paciente, // Paciente
    '/resultados/paciente/:nhc': ResultadosPacientePrivate, // Resultados de Paciente Private
    '/resultados': ResultadoPacientes, // Resultados
    '/resultado/l/:id': VisorLab, // VisorLab
    '/resultado/i/:id': VisorImg, // VisorImg
    '/viewer/:id': ViewerImg, // ViewerImg
    '/mi-perfil': MiPerfil, // MiPerfil
    '/honorarios': Honorarios, // Honorarios
    '/honorarios/auditados': HonoAuditados, //HonoAuditados
    '/honorarios/facturas-pagadas': FacturasPagadas, //FacturasPagadas
    '/honorarios/facturas-pendientes': FacturasPendientes, // FacturasPendientes
    '/honorarios/estado-de-cuenta': EstadoCuenta, // EstadoCuenta
    '/honorarios/transferencias': Transferencias, // Transferencias
    '/salir': Salir, // Salir
    '/verify': Verify, // Verify
    "/:404...": _404
};

const DefaultRoute = '/';

export { Routes, DefaultRoute }