/* eslint-disable no-useless-return */
/* eslint-disable max-classes-per-file */

// variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos

eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

  formulario.addEventListener('submit', agregarGasto);
}

// Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRest();
    // console.log(this.gastos);
  }

  calcularRest() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
    // console.log(this.restante);
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    // console.log(this.gastos);
    this.calcularRest();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    // Extraer valores
    const { presupuesto, restante } = cantidad;

    // Agregar al HTML
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    // Crear el Div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
      divMensaje.setAttribute('id', 'danger');
    } else {
      divMensaje.classList.add('alert-success');
    }

    // Mensaje de Error
    divMensaje.textContent = mensaje;
    // Insertar en el html
    document.querySelector('.primario').insertBefore(divMensaje, formulario);

    // Quitar alerta
    // eslint-disable-next-line prefer-arrow-callback
    setTimeout(function () {
      divMensaje.remove();
    }, 2500);
  }

  mostrarGastos(gastos) {
    // Limpiar HTML
    document.querySelector('.list-group').innerHTML = '';
    // Iterar sobre gastos
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      // Crear un LI
      const nuevoGasto = document.createElement('li');
      nuevoGasto.className =
        'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;
      // console.log(nuevoGasto);

      // Agregar el HTML del gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$${cantidad} </span>
      `;

      // Boton para borrar gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = ' Borrar &times';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };

      nuevoGasto.appendChild(btnBorrar);

      // Agregar al HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }

  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector('.restante');

    // Cmprbar 25 % y 75%
    if (presupuesto * 0.25 >= restante) {
      // console.log('Gastaste el 75 %');
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
      formulario.querySelector('button[type="submit"]').disabled = false;
    } else if (presupuesto * 0.5 >= restante) {
      restanteDiv.classList.remove('alert-success', 'alert-danger');
      restanteDiv.classList.add('alert-warning');
      formulario.querySelector('button[type="submit"]').disabled = false;
    } else {
      restanteDiv.classList.remove('alert-warning', 'alert-danger');
      restanteDiv.classList.add('alert-success');
      formulario.querySelector('button[type="submit"]').disabled = false;
    }

    // Si el restante es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

// Instanciar
const ui = new UI();
let presupuesto;
// Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt('Cual es tu presupuesto?');
  // presupuestoUsuario = presupuestoUsuario.trim();

  if (
    presupuestoUsuario === null ||
    presupuestoUsuario.trim() === '' ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario < 1
  ) {
    window.location.reload();
  }

  // Ya se tiene el presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  // console.log(presupuesto);
  ui.insertarPresupuesto(presupuesto);
}

// Añade gastos
function agregarGasto(e) {
  e.preventDefault();
  const msgError = document.getElementById('danger');
  if (msgError) {
    document.getElementById('danger').remove();
  }

  // Leer datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  // validar
  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
  }
  if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no valida', 'error');
    return;
  }

  // Genera objeto de Gasto
  // Esto es contrario a Distructuring
  const gasto = { nombre, cantidad, id: Date.now() };

  // Añade nuevo gasto
  presupuesto.nuevoGasto(gasto);

  ui.imprimirAlerta('Gasto agregado correctamente');

  // Imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  // reinicia el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  // Elimina del objeto
  presupuesto.eliminarGasto(id);

  // Elimina del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  // console.log(presupuesto);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
