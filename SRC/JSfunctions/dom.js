// dom.js
export const DOM = {
    d: document,

  // Fragmento para render dinámico
    fragment: document.createDocumentFragment(),

  // Contenedor principal del Home
    main: document.querySelector(".container"),

  // Sección de galería
    section: document.createElement("section"),

  // Mensaje dinámico (ej. "Todos los productos")
    mensaje: document.querySelector("#mensaje"),

  // Numerito del carrito
    numerito: document.querySelector(".numerito"),

  // Contenedor global de notificaciones
    notificaciones: (() => {
    const div = document.createElement("div");
    div.classList.add("contenedor-notificaciones");
    document.body.appendChild(div);
    return div;
    })(),

  // Contenedores del carrito
    mainContainer: document.querySelector(".main-container"),
    carritoContainer: document.getElementById("contenedor-Carrito")
};

// Estado global del carrito
export let arrayAgregarCarrito = [];

// Si quieres poder modificar arrayAgregarCarrito desde otros módulos:
export const setArrayAgregarCarrito = (nuevoArray) => {
  arrayAgregarCarrito = nuevoArray;
};
