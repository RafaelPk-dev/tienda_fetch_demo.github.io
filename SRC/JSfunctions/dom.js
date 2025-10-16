// dom.js

//obj deseos
const CLAVE_DESEOS_OBJ = 'deseosObj_v1';

const deseosObj = {
  nombreSolicitud: '',
  descripcionSolicitud: ''
};

// Carga inicial desde localStorage
try {
  const raw = localStorage.getItem(CLAVE_DESEOS_OBJ);
  if (raw) {
    const parsed = JSON.parse(raw);
    deseosObj.nombreSolicitud = parsed.nombreSolicitud ?? deseosObj.nombreSolicitud;
    deseosObj.descripcionSolicitud = parsed.descripcionSolicitud ?? deseosObj.descripcionSolicitud;
  };
} catch (err) {
  console.warn('No se pudo leer deseosObj desde localStorage', err);
};

// Helper para persistir cambios del objeto
const guardarDeseosObj=()=>{
  try {
    localStorage.setItem(CLAVE_DESEOS_OBJ, JSON.stringify({
      nombreSolicitud: deseosObj.nombreSolicitud,
      descripcionSolicitud: deseosObj.descripcionSolicitud
    }));
  } catch (err) {
    console.error('Error guardando deseosObj', err);
  };
};

const cargarDeseosObj = () => ({ 
  nombreSolicitud: deseosObj.nombreSolicitud, 
  descripcionSolicitud: deseosObj.descripcionSolicitud 
});



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

  // ARRAY DE OBJ DE LISTA DESEOS
  deseosArray: deseosObj,
  guardarDeseosObj,
  cargarDeseosObj,

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
