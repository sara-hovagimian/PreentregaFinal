// ***Definicion de productos para la venta***
const cardsProd = document.getElementById('cards');
let ListaProductos = [];
const peticionA = async () => {
    try {
        const respuesta = await fetch('/productos.json');
        if (!respuesta.ok) throw new Error('Network response was not ok');
        const data = await respuesta.json();

        ListaProductos = data; // Asignar los productos a la lista

        for (let item of data) {
            const card = document.createElement('div');
            card.innerHTML = `
                <div class="card" style="width: 18rem; height: 25rem;">
                    <img class="card-img-top" src=${item.imagen} alt=${item.descripcion} />
                    <div class="card-body">
                        <h5 class="card-title">${item.descripcion}</h5>    
                        <p class="card-text">Precio: $${item.precio * 1.21}.-</p>
                        <button onclick="addToCart(${item.codigo}, 1)" class="button_grey">Agregar al Carrito</button>
                    </div>
                </div>
            `;
            cardsProd.appendChild(card);
        }
    } catch (error) {
        console.error('Hubo un problema con la petición Fetch:', error);
    }
};
peticionA();

// ***Definicion del carrito  ***
let cart = loadCartFromLocalStorage();

// ***Función para agregar al carrito (se llama desde el botón de agregar al carrito)***
function addToCart(productId, quantity) {
    const product = ListaProductos.find(p => p.codigo === productId);
    if (!product) {
        const errorProd = document.getElementById('prodNoEncontrado');
        errorProd.innerText = `Producto no encontrado`;
        return;
    }

    // Buscar en el carrito si está el producto pasado por parametro (para sumar al existente o agregar uno nuevo)
    const cartItem = cart.find(item => item.id === productId);

    // Si el producto existe en el carrito, lo suma. Caso contrario, lo agrega
    if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.totalPrice = cartItem.quantity * product.precio;
    } else {
        cart.push({
            id: product.codigo,
            name: product.descripcion,
            price: product.precio,
            quantity: quantity,
            totalPrice: quantity * product.precio
        });
    }
    saveCartToLocalStorage();
    renderCart();
    //sweet alert para decir que se incluyó en carrito
    Swal.fire({
        title: '¡Producto agregado!',
        text: `El producto "${product.descripcion}" ha sido agregado al carrito.`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

// ***Función para eliminar item del carrito***
function removeFromCart(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        // Restar 1
        cartItem.quantity -= 1;
        cartItem.totalPrice = cartItem.quantity * cartItem.price;
        //Sweeet alert para decir que se eliminó del carrito
        Swal.fire({
            title: '¡Producto eliminado!',
            text: `El producto "${cartItem.name}" ha sido eliminado del carrito.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
        // Si la cantidad es 0, eliminar el producto del carrito
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        }

        // Guardar el carrito actualizado en el localStorage
        saveCartToLocalStorage();

        // Renderizar el carrito actualizado
        renderCart();
    }
}

// ***Función para actualizar los productos del carrito en el HTML***
function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    //Mostrar el contenido del carrito 
    cartDiv.innerHTML = cart.map(item => `
    <div>
        <p>ID: ${item.id}, Nombre: ${item.name}, Cantidad: ${item.quantity}, Precio Total: $${item.totalPrice * 1.21}</p>
        <button onclick="removeFromCart(${item.id})" class="button_red">Eliminar del carrito</button>
    </div> `).join('');

    // Calculo del total de la compra 
    let totaldesuCompra = 0;
    function calculoTotalCompra() {
        for (let index = 0; index < cart.length; index++) {
            totaldesuCompra = totaldesuCompra + cart[index].totalPrice * 1.21;
        }
        return totaldesuCompra;
    }
    const sumaTotal = calculoTotalCompra();
    const importeCompra = document.getElementById('totalCompra');
    importeCompra.innerHTML = `
       <h3>El importe de su compra es: ${totaldesuCompra} </h3>
       <h3>Puede pagar en dolares o en pesos en efectivo y en cuotas, con los siguientes intereses: 1 cuota-2%, 2 cuotas-4%, 
    3 cuotas-6%, 6 cuotas-12%,  12 cuotas-20%.</h3>`;
    importeCompra.style.fontSize = "1rem";
    importeCompra.style.fontWeight = "bold";
    const finalizarCompraDiv = document.getElementById('finalCompradiv');
    finalizarCompraDiv.innerHTML = `
    <button onclick="finalizarCompra(${sumaTotal})" class="button_red">Finalizar compra</button>
    `;
}


// ***Variable global para almacenar las cuotas
let cuotasValor = 0;

//***cotizacion del dolar oficial usando una API 
const obtenerCotizacionDolar = async () => {
    try {
        const respuesta = await fetch('https://api.bluelytics.com.ar/v2/latest');
        if (!respuesta.ok) throw new Error('Pagina no disponible');
        const data = await respuesta.json();
        const dolarOficialVenta = data.oficial.value_sell;
        document.getElementById('dolarOficialVenta').textContent = `Dólar Oficial Venta: $${dolarOficialVenta}`;
        return dolarOficialVenta;
    } catch (error) {
        console.error('Hubo un problema con la petición Fetch:', error);
        return null;
    }
};


//***funcion para finalizar compra
async function finalizarCompra(totalCompra) {
    // Mostrar SweetAlert de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Una vez finalizada la compra, no podrás modificarla.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Finalizar compra',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '¿Cómo paga?',
                text: "Puede abonar en Pesos o Dólares.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Pesos',
                cancelButtonText: 'Dólares'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    ingresarCuotas(totalCompra);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    const dolarOficialVenta = await obtenerCotizacionDolar();

                    if (dolarOficialVenta) {
                        const totalEnDolares = totalCompra / dolarOficialVenta;
                        pagoDolares(totalCompra, dolarOficialVenta, totalEnDolares);
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo obtener la cotización del dólar.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            });
        }
    });
}

//***Ingresar cuotas para el pago si es en pesos
function ingresarCuotas(totalCompra) {
    // Mostrar SweetAlert de ingreso de cuotas
    Swal.fire({
        title: 'Ingrese la cantidad de cuotas',
        html: `
        <label for="cuotas">Ingrese la cantidad de cuotas (0, 1, 2, 3, 6, 12): </label>
        <input type="number" id="cuotas" min="0" max="12" class="swal2-input">
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const cuotas = parseInt(document.getElementById('cuotas').value);
            (![0, 1, 2, 3, 6, 12].includes(cuotas)) ? Swal.showValidationMessage(`Las cuotas válidas son (0, 1, 2, 3, 6, 12).`)
                : procesarCuotas(totalCompra, cuotas);
        }
    });
}


//***funcion para el pago en dolares
function pagoDolares(totalCompra, dolarOficialVenta, totalEnDolares) {
    // Mostrar SweetAlert de importe a pagar en dolares
    Swal.fire({
        title: 'Importe en dólares',
        html: `El total en dólares es: $${totalEnDolares.toFixed(2)}`,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
    
    }).then((result) => {
        if (result.isConfirmed) {
            //promesa de envio gratis superando 500000 en pesos 
            envioGratis(totalCompra)
                .then((mensaje) => {
                    Swal.fire({
                        title: 'Información de envío',
                        text: mensaje,
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                })
                .catch((mensaje) => {
                    Swal.fire({
                        title: 'Información de Envío',
                        text: mensaje,
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                });
            setTimeout(() => {
                vaciarCarrito();
                renderCart();
                limpiarMensajes();
            }, 10000);
        }
    });
}


// ***Función para procesar las cuotas***
function procesarCuotas(totalCompra) {
    cuotasValor = parseInt(document.getElementById('cuotas').value);
    if (![0, 1, 2, 3, 6, 12].includes(cuotasValor)) {
        const errorCuotas = document.getElementById('errorCantCuotas');
        errorCuotas.innerText = `Las cuotas válidas son (0, 1, 2, 3, 6, 12).`;
        errorCuotas.style.color = "red";
        errorCuotas.style.fontWeight = "bold";
    } else {
        calcularCuotas(totalCompra, cuotasValor);
        setTimeout(() => {
            vaciarCarrito();
            renderCart();
            limpiarMensajes();
        }, 10000);
    }
}

/***funcion para limpiar los importes de la compra ***/
function limpiarMensajes() {
    const importeCompra = document.getElementById('totalCompra');
    const calculoFinanciado = document.getElementById('calculoFinanciado');
    importeCompra.innerHTML = '';
    calculoFinanciado.innerHTML = '';
}

//***funcion para vaciar el carrito ***
function vaciarCarrito() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ***Función para calcular las cuotas***
function calcularCuotas(totalCompra, cuotas) {
    let porcentaje = 0;
    if (cuotas === 0) {
        // Si cuotas es 0, impCuota es igual a totalCompra
        const impCuota = totalCompra;
        const impFinanciado = totalCompra;
        const importeFinal = document.getElementById('calculoFinanciado');
        importeFinal.innerHTML = `
        <h3>Importe: $${totalCompra}, Porcentaje: ${porcentaje}%, Importe cuota: $${impCuota.toFixed(2)}, Importe financiado: $${impFinanciado.toFixed(2)} </h3>`;
        importeFinal.style.color = "red";
        importeFinal.style.fontWeight = "bold";
        importeFinal.style.fontSize = "1.2rem";
        return;
    }

    if (cuotas === 1) porcentaje = 2;
    else if (cuotas === 2) porcentaje = 4;
    else if (cuotas === 3) porcentaje = 6;
    else if (cuotas === 6) porcentaje = 12;
    else if (cuotas === 12) porcentaje = 20;

    const impCuota = totalCompra * (1 + (porcentaje / 100)) / cuotas;
    const impFinanciado = totalCompra * (1 + (porcentaje / 100));

    const importeFinal = document.getElementById('calculoFinanciado');

    importeFinal.innerHTML = `
    <h3>Importe: $${totalCompra}, Porcentaje: ${porcentaje}%, 
    Importe cuota: $${impCuota.toFixed(2)}, Importe financiado: $${impFinanciado.toFixed(2)} </h3>`
    importeFinal.style.color = "red";
    importeFinal.style.fontWeight = "bold";
    importeFinal.style.fontSize = "1.2rem";

    //sweet alert de fin de compra
    Swal.fire({
        title: '¡fin!',
        text: `compra realizada.`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
    //promesa de envio gratis superando 500000 en pesos 
    envioGratis(impFinanciado)
        .then((mensaje) => {
            Swal.fire({
                title: 'Información de envío',
                text: mensaje,
                icon: 'info',
                confirmButtonText: 'OK'
            });
        })
        .catch((mensaje) => {
            Swal.fire({
                title: 'Información de Envío',
                text: mensaje,
                icon: 'info',
                confirmButtonText: 'OK'
            });
        });

}
//***definición de la promesa
const envioGratis = (importeEnvio) => {
    return new Promise((resolve, reject) => {
        importeEnvio >= 500000 ? resolve("Envio gratis") : reject("No califica para envio gratis");
    })
}
















// ***Guardar en el localStorage el carrito***
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ***Recuperar del localStorage el carrito***
function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

// Traer el carrito del localStorage
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});










