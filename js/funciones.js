import { Citas } from './Citas.js';
import { UI } from './UI.js';
import {
    pacienteInput,
    fechaInput,
    horaInput,
    telefonoInput,
    motivoInput,
    formulario
} from './selectores.js';



//Instancias
const administrarCitas = new Citas();
const ui = new UI(administrarCitas);

//Estado de la cita editando
let editando = false;

//Variable para indexDB
export let DB;

//Objeto inicial de cita

const citaObj = {
    paciente: '',
    telefono: '',
    fecha: '',
    hora: '',
    motivo: ''
}


export function datosCita(e) {
    //Obtener el Input
    citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
    e.preventDefault();

    const { paciente, telefono, fecha, hora, motivo } = citaObj;

    //validar

    if (paciente === '' || telefono === '' || fecha === '' || hora === '' || motivo === '') {
        ui.imprimirAlerta('Todos los campos son Obligatorios', 'error')
        return;
    }

    if (editando) {
        // Estamos editando
        administrarCitas.editarCita({ ...citaObj });

        //edita en indexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        objectStore.put(citaObj);

        transaction.oncomplete = () => {

            ui.imprimirAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

            editando = false;
        }

      
    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();
        // Añade la nueva cita
        administrarCitas.agregarCita({ ...citaObj });
        //Registro en indexDb
        const transaction = DB.transaction(['citas'], 'readwrite');
        //Habilitar el objectStore
        const objectStore = transaction.objectStore('citas');
        // Insertar en la base de datos
        objectStore.add(citaObj);

        transaction.oncomplete = function () {
            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente')
        }
    }

    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();


}

export function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.paciente = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.motivo = '';
}

export function eliminarCita(id) {
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.delete(id);

    transaction.oncomplete = () => {
        ui.imprimirCitas();
    }
    transaction.onerror = () => {
        console.log('Hubo un error al eliminar');
    }
}

export function cargarEdicion(cita) {

    const { paciente, telefono, fecha, hora, motivo, id } = cita;

    // Reiniciar el objeto

    citaObj.paciente = paciente;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.motivo = motivo;
    citaObj.id = id;

    // Llenar los Inputs
    pacienteInput.value = paciente;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    motivoInput.value = motivo;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}

export function crearDB() {
    //Crear la base de datos en version 1.0

    const crearDB = window.indexedDB.open('citas', 1);

    //Si hay un error
    crearDB.onsuccess = function () {
        console.log('BD creada');

        DB = crearDB.result;


        //mostrar citas al cargar (pero indexdb ya esta listo)
        ui.imprimirCitas();
    }

    ///Definir el schema

    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {

            keyPath: 'id',
            autoIncrement: true
        });

        //Definir todas las columnas

        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('motivo', 'motivo', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });


        console.log('Database creada y lista');
    }

}