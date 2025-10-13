// api.js
import { DOM } from "./dom.js";
import  STRIPE_KEYS from "./stripekeys.js";
//realizar la peticion dinamica via fetch async await usando promise all

export const getStripeP = async () => {
    try {
        const [res, resP] = await Promise.all([
        fetch("https://api.stripe.com/v1/products?limit=100", {
            headers: { Authorization: `Bearer ${STRIPE_KEYS.secretK}` }
        }),
        fetch("https://api.stripe.com/v1/prices?limit=100", {
            headers: { Authorization: `Bearer ${STRIPE_KEYS.secretK}` }
        })
        ]);

        if (!res.ok) {
        throw { status: res.status, statusText: res.statusText };
    }
    //Conversion de los objetos extraidos del stripeGet a json 
    const productosData = await res.json();
    const preciosData = await resP.json();
    

    //Mapeo dinamico para enbeber el array de precios y el de objetos en un solo array de objetos 
    const productosConPrecios = productosData.data.map((prod) => {
        const objPrecio = preciosData.data.find((p) => p.product === prod.id);
        return {
        id: prod.id,
        nombre: prod.name,
        descripcion: prod.description,
        img: prod.images,
        precio: objPrecio ? objPrecio.unit_amount / 100 : null,
        precioCrudo: objPrecio || null,
        productoCrudo: prod
        };
    });

    return productosConPrecios; //objeto enbebido 
    } catch (error) {
    let message = error.statusText || "Error desconocido";
    
    DOM.main.insertAdjacentHTML(
        "beforeend",
        `<p><b>Error ${error.status}, ${message}</b></p>`
    );
    return [];

    }
};
