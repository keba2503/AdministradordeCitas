import { eliminarCita, cargarEdicion } from './funciones.js'
import { contenedorCitas, heading } from './selectores.js'
import {crearDB, DB} from './funciones.js'

export class UI {

    constructor({ citas }) {
        this.textoHeading(citas);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Si es de tipo error agrega una clase
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas(citas) { // Se puede aplicar destructuring desde la función...

        this.limpiarHTML();

       

        //Leer el contenido de la base de datos

        const objectStore = DB.transaction('citas').objectStore('citas');

        const fnTextoHeading = this.textoHeading;
      

        const total = objectStore.count();

        total.onsuccess = function (citas) {
            fnTextoHeading(total.result);
        
           
        }

        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {

                const { paciente, telefono, fecha, hora, motivo, id } = cursor.value;


            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // SCRIPTING DE LOS ELEMENTOS...
            const pacienteParrafo = document.createElement('h2');
            pacienteParrafo.classList.add('card-title', 'font-weight-bolder');
            pacienteParrafo.innerHTML = `${paciente}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const motivoParrafo = document.createElement('p');
            motivoParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${motivo}`;

            // Agregar un botón de eliminar...
            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar '

            // Añade un botón de editar...
              //Boton editar
              const btnEditar = document.createElement('button');
              btnEditar.classList.add('btn', 'btn-info');
              btnEditar.innerHTML = `Editar `
              const cita = cursor.value
              btnEditar.onclick = () => cargarEdicion(cita);


            // Agregar al HTML
            divCita.appendChild(pacienteParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(motivoParrafo);
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita);
        };
    }
    }

    textoHeading(citas) {
     
        if (citas > 0) {
            heading.textContent = 'Administra tus Citas '
        } else {
            heading.textContent = 'No hay Citas, comienza creando una'
        }
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

