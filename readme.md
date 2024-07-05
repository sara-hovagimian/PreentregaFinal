### Preentrega final

El proyecto tiene 3 páginas: Productos, Sucursales y Contacto.

La página Productos está desarrollada en la página index.html. Muestra los productos. Permite agregar y eliminar de un carrito, totalizando la compra con cada operación. Los productos se tomam de un archivo JSON (productos.json).

Para finalizar se debe presionar “Finalizar compra”y se solicita si se paga en pesos o en dolares. Si se paga en pesos se solicita la cantidad de cuotas, se controla la validez del dato ingresado, al ingresar un dato válido se imprime el importe a pagar,  el porcentaje de interés, el importe de cada cuota y el importe total financiado. (Se guarda el carrito en el storage).

La cotizacion del dolar se muestra al pie de la pagina y si se selecciona pagar en dolares, se hace la conversion correspondiente a dolares.

Tanto al pagar en pesos como en dolares, si el importe supera 500.000 pesos, el envio es gratis.


En la página Contacto se muestra el formulario de contacto, permite ingresar los datos de la persona que se contacta y un mensaje. Una vez completado muestra un mensaje por pantalla avisando que los datos fueron enviados y se agrega otro mensaje mas esperando su vuelta. Los datos se guardan en el storage. Al pie del formulario de muestra la fecha del dia utilizando una API.

En la página Sucursales se muestra un carrusel con todas las sucursales de la empresa. Hay botones para avanzar y retrocer entre ellas, pero si no se presionan el avance se produce en forma automatica con un determinado intervalo de tiempo.

Solo deje dos console.error para los casos de problemas en el servidor o de conexion de APIS, para estar al tanto y tomar acciones.