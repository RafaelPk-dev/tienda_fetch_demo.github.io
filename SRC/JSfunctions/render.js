// render.js
import { DOM } from "./dom.js";

export const renderGaleria = (productos) => {
    DOM.section.innerHTML = "";
    DOM.main.classList.add("container");
    DOM.section.classList.add("cards");

    productos.forEach((el) => {
        if (el.Img && el.Img.length > 0) {
        const $article = DOM.d.createElement("article");
        $article.classList.add("content");

        const $img = DOM.d.createElement("img");
        $img.classList.add("img");
        $img.src = el.Img[0];
        $img.alt = el.NombreLimpio;

        const $tarjetaDetalle = DOM.d.createElement("div");
        $tarjetaDetalle.classList.add("tarjeta-Costo");

        const $h2Nombre = DOM.d.createElement("h2");
        $h2Nombre.classList.add("titulo");
        $h2Nombre.textContent = el.NombreLimpio;

        const $h2Precio = DOM.d.createElement("h2");
        $h2Precio.textContent = `$${el.Precio}`;

        const $botonAddToCar = DOM.d.createElement("button");
        $botonAddToCar.id = el.Id;
        $botonAddToCar.classList.add("add-card");
        $botonAddToCar.textContent = "Agregar carrito";

        $tarjetaDetalle.append($h2Nombre, $h2Precio, $botonAddToCar);
        $article.append($img, $tarjetaDetalle);
        DOM.section.appendChild($article);
        }
    });

    DOM.fragment.appendChild(DOM.section);
    DOM.main.appendChild(DOM.fragment);
    };
