import {datosCita, nuevaCita } from './funciones.js';
import {
    pacienteInput,
    fechaInput,
    horaInput,
    telefonoInput,
    motivoInput,
    formulario
} from './selectores.js';

import {crearDB} from './funciones.js'

window.onload = () => {  
    crearDB();
}

class App {
    constructor() {
        this.initApp();
    }
    
initApp() {
    pacienteInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    motivoInput.addEventListener('change', datosCita);

    //formulario
    formulario.addEventListener('submit', nuevaCita);
}
}

export default App;