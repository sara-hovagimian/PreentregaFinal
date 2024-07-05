
//creación de elementos
let formulario = document.getElementById("formulario");
const nombreForm = document.getElementById('nombreForm');
const mailForm = document.getElementById('mailForm');
const telefonoForm = document.getElementById('telefonoForm');
const comentarioForm = document.getElementById('comentarioForm');
const mainContact = document.getElementById('mainContact');
const divContact = document.createElement('div');
const textContact = document.createElement('h4');

mainContact.appendChild(divContact);
formulario.addEventListener("submit", validarFormulario);


//funcion para validar el formulario
function validarFormulario(e) {
    e.preventDefault();
    divContact.appendChild(textContact);
    formulario = e.target
    textContact.innerHTML = `Estimado/Estimada  ${nombreForm.value}. Su mensaje fue enviado. Contestaremos a la brevedad! Gracias por contactarnos!.`;
    saveFormularioToSessionStorage();

    // SweetAlert después de emitir el mensaje
    setTimeout(() => {
        Swal.fire({
            title: "Esperamos tenerlo nuevamente de vuelta por acá",
            showConfirmButton: false,
            timer: 4000,
        });
    }, 1000);
}

// Función para guardar los datos del formulario en localStorage
function saveFormularioToSessionStorage() {
    const formularioData = {
        nombre: nombreForm.value,
        mail: mailForm.value,
        telefono: telefonoForm.value,
        comentario: comentarioForm.value
    };
    sessionStorage.setItem('formularioData', JSON.stringify(formularioData));
}

//impresion de fecha al pie
const fechaActual = new Date();
const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
document.getElementById('fecha').innerText = fechaFormateada;

