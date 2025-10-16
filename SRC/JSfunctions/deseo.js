/* main-wishlist.js */
//INTEGRAR A MAINSTRIPE MODULE 

// deseo.js
// deseo.js
import { DOM } from './dom.js';
const d = DOM.d;

const CLAVE_LISTA = 'listaDeseos_v1';
const CLAVE_DESEOS_OBJ = 'deseosObj_v1';
let listaSolicitudes = [];

// --- Persistencia del objeto de inputs (usa DOM.deseosArray como fuente única) ---
const guardarDeseosObjEnStorage = () => {
    try {
        const payload = {
        nombreSolicitud: DOM.deseosArray.nombreSolicitud ?? '',
        descripcionSolicitud: DOM.deseosArray.descripcionSolicitud ?? ''
        };
        localStorage.setItem(CLAVE_DESEOS_OBJ, JSON.stringify(payload));
    } catch (err) {
        console.error('guardarDeseosObjEnStorage:', err);
    }
};

const cargarDeseosObjDesdeStorage = () => {
    try {
        const raw = localStorage.getItem(CLAVE_DESEOS_OBJ);
        if (!raw) return { nombreSolicitud: '', descripcionSolicitud: '' };
        const parsed = JSON.parse(raw);
        // sincronizar DOM.deseosArray con lo guardado
        DOM.deseosArray.nombreSolicitud = parsed.nombreSolicitud ?? '';
        DOM.deseosArray.descripcionSolicitud = parsed.descripcionSolicitud ?? '';
        return { nombreSolicitud: DOM.deseosArray.nombreSolicitud, descripcionSolicitud: DOM.deseosArray.descripcionSolicitud };
    } catch (err) {
        console.error('cargarDeseosObjDesdeStorage:', err);
        return { nombreSolicitud: '', descripcionSolicitud: '' };
    }
    };

    // --- Persistencia de la lista de solicitudes ---
    const cargarSolicitudesDesdeStorage = () => {
    try {
        const raw = localStorage.getItem(CLAVE_LISTA) || '[]';
        listaSolicitudes = JSON.parse(raw);
        if (!Array.isArray(listaSolicitudes)) listaSolicitudes = [];
    } catch (err) {
        console.error('cargarSolicitudesDesdeStorage:', err);
        listaSolicitudes = [];
    }
    };

    const guardarSolicitudesEnStorage = () => {
    try {
        localStorage.setItem(CLAVE_LISTA, JSON.stringify(listaSolicitudes));
    } catch (err) {
        console.error('guardarSolicitudesEnStorage:', err);
    }
};

// --- Util ---
const generarId = () => `wish_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// --- Render (creación de nodos, sin innerHTML) ---
const renderizarSolicitudItem = (item = {}) => {
  const contenedor = DOM.carritoContainer; // usa la propiedad existente en dom.js
    if (!contenedor) return;

    if (contenedor.querySelector(`[data-wish-id="${item.id}"]`)) return;

    const seccion = d.createElement('section');
    seccion.classList.add('carrito', 'wishlist-section');
    seccion.dataset.wishId = item.id;

    const articulo = d.createElement('article');
    articulo.classList.add('carrito-productos', 'wishlist-item');

    const divImg = d.createElement('div');
    divImg.classList.add('carrito-p');
    divImg.id=`gatito`;
    const img = d.createElement('img');
    img.classList.add('carrito-img', 'wishlist-img-sent');
    img.alt = item.title || '';
    img.src = item.img || '/PORTFOLIO/proyect1/assets/gatito.png';
    divImg.appendChild(img);

    const divNombre = d.createElement('div');
    divNombre.classList.add('carrito-producto-nombre');
    const smallLabel = d.createElement('small');
    smallLabel.textContent = 'Solicitud:';
    const h5 = d.createElement('h5');
    h5.textContent = item.title || '';
    divNombre.appendChild(smallLabel);
    divNombre.appendChild(h5);

    const divDesc = d.createElement('div');
    divDesc.classList.add('carrito-producto-cantidad');
    const smallDesc = d.createElement('small');
    smallDesc.textContent = 'DESCRIPCIÓN';
    const pDesc = d.createElement('p');
    pDesc.textContent = item.desc || '';
    divDesc.appendChild(smallDesc);
    divDesc.appendChild(pDesc);

    const divMeta = d.createElement('div');
    divMeta.classList.add('wishlist-meta');
    const spanBadge = d.createElement('span');
    spanBadge.classList.add('sent-badge');
    spanBadge.textContent = 'Enviada';

    const btnEliminar = d.createElement('button');
    btnEliminar.classList.add('btn-eliminar', 'boton-accion');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.dataset.id = item.id;

    divMeta.appendChild(spanBadge);
    divMeta.appendChild(btnEliminar);

    articulo.appendChild(divImg);
    articulo.appendChild(divNombre);
    articulo.appendChild(divDesc);
    articulo.appendChild(divMeta);
    seccion.appendChild(articulo);
    contenedor.appendChild(seccion);
};

// --- Render de toda la lista y bloque único "Eliminar Todo" ---
const renderizarTodasLasSolicitudes = () => {
    const contenedor = DOM.carritoContainer;
    if (!contenedor) return;

    contenedor.querySelectorAll('.wishlist-section').forEach(n => n.remove());
    const accionesPrevias = contenedor.querySelector('.carrito-acciones');
    if (accionesPrevias) accionesPrevias.remove();

    listaSolicitudes.forEach(item => renderizarSolicitudItem(item));

    if (listaSolicitudes.length > 0) {
        const seccionAcciones = d.createElement('section');
        seccionAcciones.classList.add('carrito-acciones');

        const articuloAcc = d.createElement('article');
        articuloAcc.classList.add('carrito-accion');

        const botonEliminarTodo = d.createElement('button');
        botonEliminarTodo.classList.add('btn-eliminar-todo', 'boton-accion');
        botonEliminarTodo.textContent = 'Eliminar Todo';
        botonEliminarTodo.type = 'button';

        articuloAcc.appendChild(botonEliminarTodo);
        seccionAcciones.appendChild(articuloAcc);
        contenedor.appendChild(seccionAcciones);
    }
};

// --- API pública: agregar, eliminar individual, eliminar todo ---
export const agregarSolicitudDesdeDOM = () => {
  // lee directamente desde DOM.deseosArray (que es el objeto compartido en dom.js)
    const titulo = (DOM.deseosArray.nombreSolicitud || '').trim();
    const descripcion = (DOM.deseosArray.descripcionSolicitud || '').trim();
    if (!titulo && !descripcion) return;

    const item = {
        id: generarId(),
        title: titulo || 'Solicitud sin título',
        desc: descripcion || '',
        img: '/PORTFOLIO/proyect1/assets/gatito.png',
        created_at: new Date().toISOString()
    };

    listaSolicitudes.unshift(item);
    guardarSolicitudesEnStorage();
        renderizarTodasLasSolicitudes();

        // limpiar objeto y persistir
        DOM.deseosArray.nombreSolicitud = '';
        DOM.deseosArray.descripcionSolicitud = '';
        guardarDeseosObjEnStorage();

        // limpiar inputs si existen
        const inputTitulo = d.getElementById('wishlistTitle');
        const textareaDesc = d.getElementById('wishlistDesc');
        if (inputTitulo) inputTitulo.value = '';
        if (textareaDesc) textareaDesc.value = '';
};

export const eliminarSolicitudPorId = (id) => {
    listaSolicitudes = listaSolicitudes.filter(i => i.id !== id);
    guardarSolicitudesEnStorage();
    const nodo = DOM.carritoContainer?.querySelector(`[data-wish-id="${id}"]`);
    if (nodo) nodo.remove();
    if (listaSolicitudes.length === 0) {
        const acciones = DOM.carritoContainer?.querySelector('.carrito-acciones');
        if (acciones) acciones.remove();
    }
    };

export const eliminarTodasLasSolicitudes = () => {
    listaSolicitudes = [];
    guardarSolicitudesEnStorage();
    const contenedor = DOM.carritoContainer;
    if (!contenedor) return;
    contenedor.querySelectorAll('.wishlist-section').forEach(n => n.remove());
    const acciones = contenedor.querySelector('.carrito-acciones');
    if (acciones) acciones.remove();
};

// --- Inicializador: sincroniza inputs con DOM.deseosArray, carga estado y delega eventos ---
export const initWishlistBehaviour = ({ selectorBoton = '#sendWishlist', idTitulo = 'wishlistTitle', idDesc = 'wishlistDesc' } = {}) => {
  // cargar estado previo
    cargarSolicitudesDesdeStorage();
    // sincronizar objeto de inputs desde storage (si hay)
    cargarDeseosObjDesdeStorage();
    renderizarTodasLasSolicitudes();

    // obtener referencias a inputs
    const inputTitulo = d.getElementById(idTitulo);
    const textareaDesc = d.getElementById(idDesc);

    // rellenar inputs con lo cargado
    if (inputTitulo) inputTitulo.value = DOM.deseosArray.nombreSolicitud || '';
    if (textareaDesc) textareaDesc.value = DOM.deseosArray.descripcionSolicitud || '';

    // listeners de input para mantener DOM.deseosArray y persistir
    if (inputTitulo) {
        inputTitulo.addEventListener('input', (e) => {
        DOM.deseosArray.nombreSolicitud = e.target.value;
        guardarDeseosObjEnStorage();
        });
    }
    if (textareaDesc) {
        textareaDesc.addEventListener('input', (e) => {
        DOM.deseosArray.descripcionSolicitud = e.target.value;
        guardarDeseosObjEnStorage();
        });
    }

    // delegación global de clicks
    d.addEventListener('click', (e) => {
        if (!e.target || !e.target.matches) return;

        // enviar (botón)
        if (e.target.matches(selectorBoton)) {
        e.preventDefault();
        // si el botón está dentro de un form, asegúrate de que tiene type="button" en HTML
        agregarSolicitudDesdeDOM();
        return;
        }

        // eliminar individual
        if (e.target.matches('.btn-eliminar')) {
        const id = e.target.dataset.id;
        if (id) eliminarSolicitudPorId(id);
        return;
        }

        // eliminar todo
        if (e.target.matches('.btn-eliminar-todo')) {
        const ok = confirm('¿Eliminar todas las solicitudes?');
        if (ok) eliminarTodasLasSolicitudes();
        return;
        }
    });
};
