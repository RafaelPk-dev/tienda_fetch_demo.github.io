// ui.js
import { DOM } from "./dom.js";
import { arrayAgregarCarrito, guardarCarrito, actualizarNumeroCarrito } from "./carrito.js";

const STORAGE_KEY = "rankingCompras";



/*Muestra una notificación flotante al agregar un producto
 */
export const mostrarNotificacion = (producto) => {
    const contenedor = DOM.d.createElement("div");
    contenedor.classList.add("notificacion");
    contenedor.setAttribute("role", "status");
    contenedor.setAttribute("aria-live", "polite");

    const small = DOM.d.createElement("small");
    small.classList.add("notif-txt");
    small.textContent = "Agregado al carrito";

    const wrapImg = DOM.d.createElement("div");
    wrapImg.classList.add("notif-img");

    const img = DOM.d.createElement("img");
    img.classList.add("imgN");
    img.src = (producto.Img && producto.Img[0]) ? producto.Img[0] : "/assets/default-thumb.jpg";
    img.alt = producto.NombreLimpio;

    wrapImg.appendChild(img);
    contenedor.append(small, wrapImg);
    DOM.notificaciones.appendChild(contenedor);

    setTimeout(() => contenedor.remove(), 3000);
};

//boton actualizado
export const botonActualizado = (productos, classBoton) => {
    DOM.d.addEventListener("click", (e) => {
        const btn = e.target.closest(classBoton);
        if (!btn) return;

        const producto = productos.find(p => p.Id === btn.id);
        if (!producto) {
        console.warn("Producto no encontrado para id:", btn.id);
        return;
        }

        const idx = arrayAgregarCarrito.findIndex(p => p.Id === btn.id);
        if (idx !== -1) {
        arrayAgregarCarrito[idx].cantidadP++;
        } else {
        arrayAgregarCarrito.push({ ...producto, cantidadP: 1 });
        }

        guardarCarrito();
        actualizarNumeroCarrito();
        mostrarNotificacion(producto);
    });
};

//filtro de productos
export const productoFiltro = (productos, selectorBoton) => {
    DOM.d.addEventListener("click", (e) => {
        if (!e.target.matches(selectorBoton)) return;

        const categoria = e.target.id.trim().toLowerCase();
        let titulo = "Todos los Productos";

        switch (categoria) {
        case "coctel": titulo = "Cocteles"; break;
        case "cafes": titulo = "Cafes"; break;
        case "snack": titulo = "Snacks"; break;
        }
        DOM.mensaje.textContent = titulo;

        const lista = (categoria === "todos")
        ? productos
        : productos.filter(p => p.Categoria.trim().toLowerCase() === categoria);

        if (lista.length === 0) {
        DOM.section.innerHTML = "";
        const $mensajeS = DOM.d.createElement("h2");
        $mensajeS.textContent = "No hay productos disponibles";
        DOM.section.appendChild($mensajeS);
        return;
        }

        // Renderizar galería con los productos filtrados
        import("./render.js").then(({ renderGaleria }) => {
        renderGaleria(lista);
        });
    });
    };


/* Activa la vista ampliada de un producto en desktop
 */
let vistaAmpliadaInicializada = false;

export const activarVistaAmpliada = (selectorTarjeta, productos) => {
    if (window.innerWidth <= 1024 || vistaAmpliadaInicializada);
    vistaAmpliadaInicializada = true;

    DOM.d.addEventListener("click", (e) => {
    const tarjeta = e.target.closest(selectorTarjeta);
    if (!tarjeta) return;

    // Ignorar si el click fue en el botón .add-card de esa tarjeta
    const botonDentroTarjeta = e.target.closest("button.add-card");
    if (botonDentroTarjeta && tarjeta.contains(botonDentroTarjeta)) return;

    // Obtener producto
    const idProducto = tarjeta.querySelector(".add-card")?.id;
    const producto = productos.find(p => p.Id === idProducto);
    if (!producto) return;

    // Overlay
    const fondoBlur = DOM.d.createElement("div");
    fondoBlur.classList.add("overlay-blur");

    const tarjetaAmpliada = DOM.d.createElement("article");
    tarjetaAmpliada.classList.add("card-ampliada");

    // Título
    const h3 = DOM.d.createElement("h3");
    h3.textContent = producto.NombreLimpio;

    // Imagen
    const img = DOM.d.createElement("img");
    img.src = (producto.Img && producto.Img[0]) ? producto.Img[0] : "/assets/default.jpg";
    img.alt = producto.NombreLimpio;

    // Descripción
    const small = DOM.d.createElement("small");
    small.textContent = producto.Descripcion || "Sin descripción";

    // Botón agregar al carrito
    const boton = DOM.d.createElement("button");
    boton.classList.add("add-card");
    boton.id = producto.Id;

    const icono = DOM.d.createElement("img");
    icono.src = "/PORTFOLIO/proyect1/assets/sale_basket_cart_ecommerce_on_buy_shop_trolley_bag_shopping_icon_266849.svg"; // ruta a tu icono
    icono.alt = "Agregar al carrito";
    icono.classList.add("icono-boton");

    boton.appendChild(icono);

    // Evento agregar al carrito desde vista ampliada
    boton.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const idx = arrayAgregarCarrito.findIndex(p => p.Id === producto.Id);
        if (idx !== -1) {
            arrayAgregarCarrito[idx].cantidadP++;
        } else {
            arrayAgregarCarrito.push({ ...producto, cantidadP: 1 });
        }
        guardarCarrito();
        actualizarNumeroCarrito();
        mostrarNotificacion(producto);
        });

        // Montar tarjeta ampliada
        tarjetaAmpliada.append(h3, img, small, boton);
        fondoBlur.appendChild(tarjetaAmpliada);
        DOM.d.body.appendChild(fondoBlur);

        // Bloquear scroll
        DOM.d.body.style.overflow = "hidden";

        // Cerrar al hacer clic fuera
        fondoBlur.addEventListener("click", (ev) => {
        if (ev.target === fondoBlur) {
            DOM.d.body.style.overflow = "";
            fondoBlur.remove();
        }
        });

        // Cerrar con ESC
        const escHandler = (ev) => {
        if (ev.key === "Escape") {
            DOM.d.body.style.overflow = "";
            fondoBlur.remove();
            DOM.d.removeEventListener("keydown", escHandler);
        }
        };
        DOM.d.addEventListener("keydown", escHandler);
    });
};


/*
 Renderiza el carrusel de productos más comprados
 */
export const renderTopProductos = (rankingArray = null) => {
    const ranking = rankingArray || JSON.parse(localStorage.getItem("rankingCompras")) || [];
    const productosOrdenados = [...ranking].sort((a, b) => b.cantidadP - a.cantidadP);

    const existing = DOM.d.querySelector(".top-wrapper");
    if (existing) existing.remove();

    const wrapper = DOM.d.createElement("div");
    wrapper.classList.add("top-wrapper");

    const titulo = DOM.d.createElement("h2");
    titulo.textContent = "Más comprados";
    wrapper.appendChild(titulo);
        //condicional que revisa si hay productos ordenados
    if (productosOrdenados.length === 0) {
        const mensaje = DOM.d.createElement("p");
        mensaje.textContent = "Realiza una compra";
        wrapper.appendChild(mensaje);

    } else {//render
        const carrusel = DOM.d.createElement("div");
        carrusel.classList.add("carrusel-top");

        // Duplicamos los items para el loop infinito
        const duplicados = [...productosOrdenados, ...productosOrdenados];

        duplicados.forEach((prod, index) => {
        const item = DOM.d.createElement("div");
        item.classList.add("carrusel-item");

        const img = DOM.d.createElement("img");
        img.src = (prod.Img && prod.Img[0]) ? prod.Img[0] : "/assets/default.jpg";
        img.alt = prod.NombreLimpio;

        const nombre = DOM.d.createElement("p");
        nombre.textContent = prod.NombreLimpio;

        const rankingTxt = DOM.d.createElement("span");
        rankingTxt.classList.add("ranking-txt");
        rankingTxt.textContent = `Top ${(index % productosOrdenados.length) + 1}`;

        const cantidadPO= DOM.d.createElement("p");
        cantidadPO.classList.add("ranking-txt");
        cantidadPO.textContent = `Cantidad: ${prod.cantidadP}`;

        item.append(img, nombre, cantidadPO,rankingTxt);
        carrusel.appendChild(item);
        });

        wrapper.appendChild(carrusel);
    }

    const target = DOM.mensaje?.parentNode || DOM.mainContainer || DOM.main || DOM.d.body;
    target.insertBefore(wrapper, DOM.mensaje || target.firstChild);
};





