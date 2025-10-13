// carrito.js
import { DOM } from "./dom.js";
import stripekeys from "./stripekeys.js";
import { renderTopProductos } from "./ui.js";
export let arrayAgregarCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
export let arrayGaleriaCarrusel
    // Función para guardar siempre que se modifique
    export const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(arrayAgregarCarrito));
};

    /*
     * Actualiza el numerito del carrito en el header
     */
    export const actualizarNumeroCarrito = () => {
    const numerito = arrayAgregarCarrito.reduce((acc, p) => acc + p.cantidadP, 0);

    if (DOM.numerito) {
        DOM.numerito.textContent = numerito;
    } else {
        console.warn("DOM.numerito no está presente en esta página");
    }
};


    /**
     * Renderiza el carrito completo
     */
    export const renderCarrito = (carrito) => {
    DOM.carritoContainer.innerHTML = "";
    const $sectionCarrito = DOM.d.createElement("section");
    $sectionCarrito.classList.add("carrito");

    if (carrito.length === 0) {
        const mensajeVacio = DOM.d.createElement("p");
        mensajeVacio.classList.add("carrito-text");
        mensajeVacio.textContent = "Tu carrito está vacío";
        $sectionCarrito.appendChild(mensajeVacio);
        DOM.carritoContainer.appendChild($sectionCarrito);
        return;
    }

    carrito.forEach(prod => {
        const $article = DOM.d.createElement("article");
        $article.classList.add("carrito-productos");

        // Imagen
        const $divImg = DOM.d.createElement("div");
        $divImg.classList.add("carrito-p");
        const $img = DOM.d.createElement("img");
        $img.classList.add("carrito-img");
        $img.src = (prod.Img && prod.Img[0]) ? prod.Img[0] : "/assets/default-thumb.jpg";
        $img.alt = prod.NombreLimpio;
        $divImg.appendChild($img);

        // Nombre
        const $divNombre = DOM.d.createElement("div");
        $divNombre.classList.add("carrito-producto-nombre");
        const $smallTitulo = DOM.d.createElement("small");
        $smallTitulo.textContent = "TÍTULO";
        const $h3Nombre = DOM.d.createElement("h3");
        $h3Nombre.textContent = prod.NombreLimpio;
        $divNombre.append($smallTitulo, $h3Nombre);

        // Cantidad
        const $divCantidad = DOM.d.createElement("div");
        $divCantidad.classList.add("carrito-producto-cantidad");
        const $smallCantidad = DOM.d.createElement("small");
        $smallCantidad.textContent = "CANTIDAD";
        const $pCantidad = DOM.d.createElement("p");
        $pCantidad.textContent = prod.cantidadP;
        $divCantidad.append($smallCantidad, $pCantidad);

        // Precio
        const $divPrecio = DOM.d.createElement("div");
        $divPrecio.classList.add("carrito-producto-precio");
        const $smallPrecio = DOM.d.createElement("small");
        $smallPrecio.textContent = "PRECIO";
        const $pPrecio = DOM.d.createElement("p");
        $pPrecio.textContent = `$${prod.Precio}`;
        $divPrecio.append($smallPrecio, $pPrecio);

        // Subtotal
        const $divSubtotal = DOM.d.createElement("div");
        $divSubtotal.classList.add("carrito-producto-subtotal");
        const $smallSubtotal = DOM.d.createElement("small");
        $smallSubtotal.textContent = "SUBTOTAL";
        const $pSubtotal = DOM.d.createElement("p");
        $pSubtotal.textContent = `$${(prod.Precio * prod.cantidadP).toFixed(2)}`;
        $divSubtotal.append($smallSubtotal, $pSubtotal);

        // Botones
        const $divBotones = DOM.d.createElement("div");
        $divBotones.classList.add("carrito-producto-botones");

        const $btnComprar = DOM.d.createElement("button");
        $btnComprar.classList.add("btn-comprar", "boton-accion");
        $btnComprar.id = prod.PrecioCrudo.id;
        $btnComprar.textContent = "Comprar";

        
        const $btnEliminar = DOM.d.createElement("button");
        $btnEliminar.classList.add("btn-eliminar", "boton-accion");
        $btnEliminar.id = prod.Id;
        $btnEliminar.textContent = "Eliminar";

        $divBotones.append($btnComprar, $btnEliminar);

        console.log("boton creado:", $btnComprar.outerHTML);

        // Montar artículo
        $article.append($divImg, $divNombre, $divCantidad, $divPrecio, $divSubtotal, $divBotones);
        $sectionCarrito.appendChild($article);
        console.log(prod);
    });

    // Sección acciones
    const sectionAcciones = DOM.d.createElement("section");
    sectionAcciones.classList.add("carrito-acciones");

    const articleAccion = DOM.d.createElement("article");
    articleAccion.classList.add("carrito-accion");

    const divImporteTxt = DOM.d.createElement("div");
    divImporteTxt.classList.add("carrito-acciones-IT")
    const smallImporte = DOM.d.createElement("small");
    smallImporte.textContent = "Importe Total";
    smallImporte.classList.add("importe-label")
    divImporteTxt.appendChild(smallImporte);

    const divImporteValor = DOM.d.createElement("div");
    const pImporte = DOM.d.createElement("p");
    const total = carrito.reduce((acc, prod) => acc + prod.Precio * prod.cantidadP, 0);
    pImporte.textContent = `$${total.toFixed(2)}`;
    divImporteValor.appendChild(pImporte);

    const btnEliminarTodo = DOM.d.createElement("button");
    btnEliminarTodo.classList.add("btn-eliminar-todo");
    btnEliminarTodo.textContent = "Eliminar todo";

    articleAccion.append(divImporteTxt, divImporteValor, btnEliminarTodo);
    sectionAcciones.appendChild(articleAccion);

    // Insertar todo en el main
    DOM.carritoContainer.append($sectionCarrito, sectionAcciones);
    };

    /*
     * Elimina un producto del carrito por ID
     */
    export const eliminarProductosCarrito = (classSelector) => {
    DOM.d.addEventListener("click", (e) => {
        if (e.target.matches(classSelector)) {
        const IDboton = e.target.id;
        const index = arrayAgregarCarrito.findIndex(p => p.Id === IDboton);
        if (index !== -1) {
            arrayAgregarCarrito.splice(index, 1);
            guardarCarrito();
            renderCarrito(arrayAgregarCarrito);
        }
        }
    });
    };

    export const eliminarTodosProductos = (classSelector) => {
        DOM.d.addEventListener("click", (e) => {
            if (e.target.matches(classSelector)) {
            console.log("Botón eliminar todo clickeado:", e.target);

            // Vaciar el array original directamente
            arrayAgregarCarrito.length = 0;

            // Guardar en localStorage
            guardarCarrito();
            renderCarrito(arrayAgregarCarrito);
            // Actualizar numerito y render
            actualizarNumeroCarrito();
            
            }
        });
    };

    /**
     * Vacía completamente el carrito
     */
    export const realizarCompra = (classSelector, arrayAC) => {
    DOM.d.addEventListener("click", (e) => {
        if (e.target.matches(classSelector)) {
        const precioID = e.target.id;
        // const precio=arrayAC.find(p=>p.Precio);//obtener precio del prodcuto
        // const cantidad= arrayAC.find(c=>c.cantidadP);
        //obteniendo la llave publica de stripe

        Stripe(stripekeys.publicK).redirectToCheckout({
            //parametros a pasar al metodo redirectToCheckout
            lineItems:[{price:precioID, quantity:1}],
            mode:"subscription",
            successUrl:"http://127.0.0.1:5500/PORTFOLIO/proyect1/Carrito.html"
        }).then(res=>{
            if(res.error){
                console.log(res);
                console.error(res.error);
            }
        });//promesa
        
        /*llamada a stripe pasarela de pago

        const ranking=arrayAC.find(ind=>ind.Id===IDboton);
        if(!ranking){
            alert("el array fallo");
        }else{
            const nuevoPG={...ranking};
            arrayGaleriaCarrusel.push(nuevoPG);
        }

        localStorage.setItem("carrito", JSON.stringify(arrayGaleriaCarrusel));*/
        }
    });
    };
