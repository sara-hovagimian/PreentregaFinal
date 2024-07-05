
//definiciones para el encabezado y el footer
const cabecera = document.getElementById('header');
const navegacion = document.createElement('navbar');
const nav = document.createElement('nav');
const ul = document.createElement('ul');
const footer = document.getElementsByTagName('footer');
const textoFooter = document.createElement('p');
const liImagen = document.createElement('li');
const img = document.createElement('img');
const ORIGEN = document.createElement('a');

// incorporacion de barra de elemento sde la barra de navegación
cabecera.appendChild(navegacion);
navegacion.appendChild(nav);
nav.appendChild(ul);

//logo e ir a pagina principal
ORIGEN.href = '/';
ORIGEN.appendChild(img);
img.src = 'assets/logo_Electro_Mundo.jpg';
img.alt = 'Electro Mundo';
liImagen.appendChild(ORIGEN);
ul.appendChild(liImagen);

//agregado de una clase a navbar
navegacion.className = 'navbar';

//array de links para el menu 
const links = ["Productos", "Sucursales", "Contacto"];

//creacion de li con un array
for (const link of links) {
    const li = document.createElement('li');
    if (link === links[0]) {
        li.innerHTML = `<a href = "index.html" >${link}</a>`//en index.html se ubica la página de Productos
        ul.appendChild(li);
    }
    else {
        li.innerHTML = `<a href = "${link.toLowerCase()}.html" >${link}</a>`
        ul.appendChild(li);
    }
}

footer[0].appendChild(textoFooter);
textoFooter.innerHTML = `Empresa Electro Mundo V 1.0.0 ' - <img src="assets/logochico.jpg" alt="logo" />`;