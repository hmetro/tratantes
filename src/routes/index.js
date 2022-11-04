// Pages here
import App from '../views/app'
import Salir from '../views/salir'
import Login from '../views/login/login'
import Inicio from '../views/inicio/inicio'
import Pacientes from '../views/pacientes/pacientes';
import Paciente from '../views/paciente/paciente';
import Resultados from '../views/resultados/resultados';
import ResultadoPaciente from '../views/paciente/resultadosPaciente';


import MiPerfil from '../views/perfil/perfil';
import _404 from '../views/404'
import ResultadosImagen from '../views/imagen/resultados';
import ResultadoImagen from '../views/imagen/resultado';





// Routes here
const Routes = {
    '/': App,
    '/inicio': Inicio, //Inicio
    '/auth': Login, // Login
    '/pacientes': Pacientes, // Pacientes
    '/paciente/:nhc': Paciente, // Pacientes
    '/resultados/paciente/:nhc': ResultadoPaciente, // Resultados de Paciente
    '/resultados': ResultadosImagen, // Resultados de Paciente
    '/resultado/imagen/:id': ResultadoImagen, // Resultado de Paciente
    '/mi-perfil': MiPerfil, // MiPerfil
    '/salir': Salir, // Salir
    "/:404...": _404
};

const DefaultRoute = '/';

export { Routes, DefaultRoute }