//EL MEJOR INTENTO DE CODIGO QUE HE HECHO 


//modularidad 
import { DOM } from "./dom.js";
import { getStripeP } from "./api.js";
import { clasificarProductos } from "./productos.js";
import { renderGaleria } from "./render.js";
import { 
    mostrarNotificacion, 
    activarVistaAmpliada, 
    productoFiltro, 
    botonActualizado,
    renderTopProductos, 
} from "./ui.js";
import menuHamburguesa from "./menuHamb.js"
import { 
    arrayAgregarCarrito, 
    renderCarrito,
    actualizarNumeroCarrito,
    realizarCompra,
    eliminarProductosCarrito, 
    eliminarTodosProductos
} from "./carrito.js";

import { 
    initWishlistBehaviour,
    agregarSolicitudDesdeDOM,
    eliminarSolicitudPorId,
    eliminarTodasLasSolicitudes
        } from "./deseo.js";


// DOMContentLoaded
DOM.d.addEventListener("DOMContentLoaded", async () => {
    menuHamburguesa(".boton-menu", ".boton-menu-a", ".menuHamb");

    try {
        const productosConPrecios = await getStripeP();
        const arrayFiltradoProducto = clasificarProductos(productosConPrecios);

        // Cache para top
        localStorage.setItem("productosCache", JSON.stringify(arrayFiltradoProducto));


        // Render inicial
        if (DOM.d.body.id === "home") {
        DOM.mensaje.textContent = "Todos los Productos";
        renderGaleria(arrayFiltradoProducto);
        renderTopProductos();
        productoFiltro(arrayFiltradoProducto, ".boton-navegador");
        botonActualizado(arrayFiltradoProducto, ".add-card");
        activarVistaAmpliada(".content", arrayFiltradoProducto);
        renderTopProductos(arrayAgregarCarrito);
        actualizarNumeroCarrito();

        //render del carrito detectado el id
        } else if (DOM.d.body.id === "carrito") {

        renderCarrito(arrayAgregarCarrito);
        renderTopProductos(arrayAgregarCarrito);
        renderTopProductos(arrayAgregarCarrito);
        realizarCompra(".btn-comprar", arrayAgregarCarrito);
        eliminarProductosCarrito(".btn-eliminar");
        eliminarTodosProductos(".btn-eliminar-todo");
        } else if(DOM.d.body.id==="deseo"){
            console.log("lista de deseos a implementar ");
            // const btnElimi=`#removeWishList`;// id de boton eliminar 
            // renderSolicitud();
            // eliminarDeseo(btnElimi);
            actualizarNumeroCarrito();
            initWishlistBehaviour({
            selectorBoton: '#sendWishlist',
            idTitulo: 'wishlistTitle',
            idDesc: 'wishlistDesc'
        });
        };

    } catch (error) {
        console.error("Error al cargar la tienda:", error);
        if (DOM.main) {
        DOM.main.insertAdjacentHTML("beforeend", `<p><b>Error al cargar la tienda</b></p>`);
        }
    }
});

