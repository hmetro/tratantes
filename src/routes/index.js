// Pages here
import App from '../views/app'
import Salir from '../views/salir'
import Login from '../views/login/login'
import Inicio from '../views/inicio/inicio'
import Pacientes from '../views/pacientes/pacientes';
import Paciente from '../views/paciente/paciente';
import ResultadosPaciente from '../views/paciente/resultados';
import MiPerfil from '../views/perfil/perfil';
import _404 from '../views/404'
import ResultadosPacientePrivate from '../views/paciente/resultadosPrivate';
import VisorLab from '../views/visor/visorLab';





// Routes here
const Routes = {
    '/': App,
    '/inicio': Inicio, //Inicio
    '/auth': Login, // Login
    '/pacientes': Pacientes, // Pacientes
    '/resultados/paciente/:nhc': ResultadosPaciente, // Resultados de Paciente
    '/resultados': ResultadosPacientePrivate, // Resultados de Paciente
    '/resultado/l/:id': VisorLab, // Resultado de Paciente
    '/mi-perfil': MiPerfil, // MiPerfil
    '/salir': Salir, // Salir
    "/:404...": _404
};

const DefaultRoute = '/';

export { Routes, DefaultRoute }