import STRIPE_KEYS from "./stripekeys.js"
import menuHamburguesa from "./menuHamb.js";

const d = document,
    $fragment = d.createDocumentFragment(),
    $main = d.querySelector(".container"),
    $contenedorGlobalNotificaciones=d.createElement("div"),
    $section = d.createElement("section"),
    $mensaje=d.querySelector("#mensaje"),
    $numerito=d.querySelector(".numerito");
    
    //array con productos agregados dado el click sobre el boton agregar al carrito
    let arrayAgregarCarrito=[];
    
    
    $contenedorGlobalNotificaciones.classList.add("contenedor-notificaciones");
    d.body.appendChild($contenedorGlobalNotificaciones);
    


    //DECLARACIONES DE CARRITO
    const $mainC=d.querySelector(".main-container");
    const $carritoContainer= d.getElementById("contenedor-Carrito");
    
    
    //realizar la peticion dinamica via fetch async await usando promise all
const getStripeP= async ()=> {
    //implemento directamente un try catch al inicio de la funcion, estructura definitiva, en el try evaluo la peticion fetch como antes cuando implemente fetch para optener un arreglo y una peticion la logica seria retornar ese arreglo convertido y listonpara ser usado
    
    try {
    //SEGUNDA ITERACION CON PETIsION EN PARALELO DE STRIPE dentro del bloque try

    //esta declaracion sirve para poder aniadir las peticiones por separado en cada variable 
    const [res, resP] = await Promise.all([
        fetch("https://api.stripe.com/v1/products?limit=100", {
        headers: {
            Authorization: `Bearer  ${STRIPE_KEYS.secretK}`
        }   
    }),
        fetch("https://api.stripe.com/v1/prices?limit=100", {
        headers: {
            Authorization: `Bearer  ${STRIPE_KEYS.secretK}`
        }
    })
    ]);

    
    //condicion que permite status 200
    if (!res.ok) {
    //pequenio objeto que recibe en atributos el estatus de la respuesta y el estatus text
        throw { status: res.status, 
            statusText: res.statusText 
        };
    }
    //parseos de las respuestas a json
    const STHtml = await res.json(),
    preciosData= await resP.json();
    
    //creacion de arrays iterables 
    const arrayP = STHtml.data,
    arrayD=preciosData.data;
    console.log(STHtml);
    console.log(arrayP);
    console.log(arrayD);

    //mapeo de arreglos usando array.map y coinsidencencia usando array.find para crear un nuevo objeto con los precios enbebidos 

    const productosConPrecios = arrayP.map((prod)=>{
        //buscaremos en ese producto uno que coincida con el id de precios
        const objPrecio =arrayD.find((p)=> p.product===prod.id);// manera de emparejar ids de dferentes arreglos

        //construiremos un nuevo objeto enriquecido que enbebe el arreglo de precios 
        return {
            id: prod.id,
            nombre: prod.name,
            descripcion: prod.description,
            img: prod.images,
            precio: objPrecio ? objPrecio.unit_amount / 100 : null,
            precioCrudo: objPrecio||null,
            productoCrudo:prod
        };
        
    });
    return {productosConPrecios };

    } catch (error) {
        let message = error.statusText || "Error desconocido";
        $main.insertAdjacentHTML("beforeend",`<p><b>Error ${error.status}, ${message}</b></p>`);
        }

    };

        //agregando nuevo atributo al array de objetos que muestra la categoia de los productos
const clasificarProductos=(prodC)=> {
    const arrayFiltradoProducto=prodC.map((elementoP)=>{

        const palabras= elementoP.nombre.trim().split(" ");//corta el nombre string un espacio
        const categoriaP= palabras[palabras.length-1].toLowerCase(); //

        //Lista de categorias validas que deseo 
        const categoriasValidas =["snack", "coctel", "cafes"];

        //condicional que extrae la ultima palabra si cumple con las condiciones del array categorias validas
        const categoria= categoriasValidas.includes(categoriaP)
        ? categoriaP.charAt(0).toUpperCase()+ categoriaP.slice(1):"Sin Categoria ";

        //nombre limpio sin la categoria 
        const nombreLimpio= categoriasValidas.includes(categoriaP)
        ? palabras.slice(0,-1).join(" "):prodC.nombre;

        return{
            Id: elementoP.id,
            Nombre: elementoP.nombre,
            Descripcion: elementoP.descripcion,
            Img: elementoP.img,
            Precio: elementoP.precio,
            PrecioCrudo: elementoP.precioCrudo,
            ProductoCrudo: elementoP.productoCrudo,
            NombreLimpio : nombreLimpio,
            Categoria: categoria
        };


    });

    return {arrayFiltradoProducto};
    };

    //asignar estilos y renderizar dinamicamente el dom
const renderGaleria= (products)=> {
    $section.innerHTML=" ";
    $main.classList.add("container");
    $section.classList.add("cards");
    
    
    products.forEach(el => {
        //programo una condicion para verificar que el array de imagenes no esta vacio y que la propiedad images existe en el array 
        console.log(el);
        if (el.Img && el.Img.length > 0) {
            //galeria
            const $article=d.createElement("article");
            $article.classList.add("content");

            const $img = d.createElement("img");
            $img.classList.add("img");
            $img.src = el.Img[0];
            $img.alt = el.NombreLimpio;

            const $tarjetaDetalle = d.createElement("div");
            $tarjetaDetalle.classList.add("tarjeta-Costo");

            const $h2Nombre = d.createElement("h2");
            $h2Nombre.classList.add("titulo");
            $h2Nombre.textContent = el.NombreLimpio;

            const $h2Precio = d.createElement("h2");
            $h2Precio.textContent = `$${el.Precio}`;

            const $botonAddToCar = d.createElement("button");
            $botonAddToCar.id = el.Id;
            $botonAddToCar.classList.add("add-card");
            $botonAddToCar.textContent = "agregar carrito";

            $tarjetaDetalle.appendChild($h2Nombre);
            $tarjetaDetalle.appendChild($h2Precio);
            $tarjetaDetalle.appendChild($botonAddToCar);

            $article.appendChild($img);
            $article.appendChild($tarjetaDetalle);
            $section.appendChild($article);
            
        }     
        
    });
    
    $fragment.appendChild($section);
    $main.appendChild($fragment);
    activarVistaAmpliada();
    
    };

    //render de notificacion
const mostrarNotificacion = (producto)=> {
    const contenedorNotificaciones = d.createElement("div");
    contenedorNotificaciones.classList.add("notificacion");
    contenedorNotificaciones.innerHTML="";

    const notificacionSmall=d.createElement("small");
    notificacionSmall.classList.add("notif-txt");
    notificacionSmall.textContent="agregado al carrito";

    const notificacionImg = d.createElement("div");
    notificacionImg.classList.add("notif-img");

    const img = d.createElement("img");
    img.classList.add("imgN");
    img.src = producto.Img[0];
    img.alt = producto.NombreLimpio;


    notificacionImg.appendChild(img);
    contenedorNotificaciones.appendChild(notificacionSmall);
    contenedorNotificaciones.appendChild(notificacionImg);
    $contenedorGlobalNotificaciones.appendChild(contenedorNotificaciones);
    // Eliminar después de 3 segundos
    setTimeout(() => {
        contenedorNotificaciones.remove();
    }, 3000);
};
    
    //filtra el array de productos en funcion del id del boton del menu
const productoFiltro=(FiltradoProducto, botonC )=>{
    d.addEventListener("click", e=>{
        
        if(e.target.matches(botonC)){
        const categoria=e.target.id.trim().toLowerCase();
        const productosClasificados=FiltradoProducto.filter(prod=>prod.Categoria.trim().toLowerCase()===categoria);

                
                if(categoria==="todos"){
                    $mensaje.textContent="Todos los Productos";

                    renderGaleria(FiltradoProducto);
                    return;//termina de evaluar aqui
                }else if(categoria==="coctel"){
                    $mensaje.textContent="Cocteles";
                }else if(categoria==="cafes"){
                    $mensaje.textContent="Cafes";

                }else $mensaje.textContent="Snacks";
                
                
                //condicional para comprobar que hay productos
                if(productosClasificados.length===0){
                    $mensaje.innerHTML="";
                    $section.innerHTML="";
                    const $mensajeS=d.createElement("h2");
                    $mensajeS.textContent="No hay productos disponibles"

                    $mensaje.textContent=" No hay disponibilidad de este servicio ahora";
                    $section.appendChild($mensajeS);
                } else{
                    //renderizar galeria normalmente
                    renderGaleria(productosClasificados);
                }
                
                    
        }       
                
                
    });
        
};


    //actualizacion de los botones para poder tomar la informacion dado su id mas actualizacion del numero que notifica que hay productos en el carrito
const actualizarNumeroCarrito=()=>{
    let numerito= arrayAgregarCarrito.reduce((acc, red)=> acc+red.cantidadP, 0);
    $numerito.textContent= numerito;
};

const botonActualizado=(FiltradoProducto ,classBoton)=>{
    //la logica aqui es capturar el boton mediante la clase solicitada en la funcion para luego dada la coincidencia del click sobre el boton pushear el id del producto en un nuevo array con los productos del carrito y obtener un nuevo array con los productos unicamente aniadidos a ese array
    d.addEventListener("click", e=>{
        if(e.target.matches(classBoton)){
            
            const botonId=e.target.closest(classBoton),
            IDboton=botonId.id,
            productoEnCarrito=FiltradoProducto.find(p=>p.Id===IDboton);
            console.log(productoEnCarrito);
            //condicion para sumar productos
            
            if(!productoEnCarrito){
                //notificacion  que me permitira saber si el array de productos esta funcionando
                console.warn('No se encontro un producto con id solicitado');
                return;

            };
            //guardando el indice del arrayAgregarCarrito    
            const indiceC=arrayAgregarCarrito.findIndex(ind=>ind.Id===IDboton);

            if(indiceC!==-1){
                //suma iterativa de productos para actualizar solo la cantidad de estos
                arrayAgregarCarrito[indiceC].cantidadP++;
            }else{
                const nuevoP={...productoEnCarrito,cantidadP:1};//agregando un nuevo atributo al objeto cantidad
                arrayAgregarCarrito.push(nuevoP);
                console.log(arrayAgregarCarrito);
                //gaurdado del array para que percista en la carga del carrito y poderlo renderizar
                
            };
            localStorage.setItem("carrito", JSON.stringify(arrayAgregarCarrito));
            actualizarNumeroCarrito();
            mostrarNotificacion(productoEnCarrito);
        };
    });
};    

/*
info para mejorar las tarjetas ampliadas  

*/
const activarVistaAmpliada=(tarjetas, productos) => {
    if (window.innerWidth <= 1024) return;

    d.addEventListener("click", (e) => {
    // Verificación de click sobre una tarjeta
    const tarjetaC = e.target.closest(tarjetas);
    if (!tarjetaC) return;

    //Ignorar clicks en el botón de la tarjeta de la galería
    if (e.target.closest(".add-card")) {
        return;
    }

    const idProducto = tarjetaC.querySelector(".add-card")?.id;
    const producto = productos.find(p => p.Id === idProducto);
    if (!producto) return;

    // Crear fondo difuminado
    const fondoBlur = d.createElement("div");
    fondoBlur.classList.add("overlay-blur");

    // Crear tarjeta ampliada desde cero
    const tarjetaAmpliada = d.createElement("article");
    tarjetaAmpliada.classList.add("card-ampliada");

    // Título
    const h3 = d.createElement("h3");
    h3.textContent = producto.NombreLimpio;

    // Imagen
    const img = d.createElement("img");
    img.src = Array.isArray(producto.Img) && producto.Img[0] ? producto.Img[0] : "ruta/default.jpg";
    img.alt = producto.NombreLimpio;

    // Descripción
    const small = d.createElement("small");
    small.textContent = producto.Descripcion || "Sin descripción";

    // Botón agregar al carrito
    const boton = d.createElement("button");
    boton.classList.add("add-card");
    boton.id = producto.Id;

    // Imagen dentro del botón
    const icono = d.createElement("img");
    icono.src = "../assets/cash_dollar_coin_payment_finance_bank_currency_money_business_cryptocurrency_bitcoin_icon_266847.svg"; 
    icono.alt = "Agregar al carrito";
    icono.classList.add("icono-boton");

    // lo insertamos dentro del botón
    boton.appendChild(icono);

    // Evitar propagación y mantener funcionalidad
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        const indice = arrayAgregarCarrito.findIndex(p => p.Id === producto.Id);
        if (indice !== -1) {
            arrayAgregarCarrito[indice].cantidadP++;
        } else {
            arrayAgregarCarrito.push({ ...producto, cantidadP: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(arrayAgregarCarrito));
        actualizarNumeroCarrito();
        mostrarNotificacion(producto);
        });

        // Montar tarjeta
        tarjetaAmpliada.appendChild(h3);
        tarjetaAmpliada.appendChild(img);
        tarjetaAmpliada.appendChild(small);
        tarjetaAmpliada.appendChild(boton);

        fondoBlur.appendChild(tarjetaAmpliada);
        d.body.appendChild(fondoBlur);

        // Cerrar al hacer clic fuera
        fondoBlur.addEventListener("click", (e) => {
        if (e.target === fondoBlur) {
            fondoBlur.remove();
        }
        });
    });
};




//  PROGRAMACION ORIENTADA AL RENDER DEL CARRITO

    //renderizado dinamico del carrito
const renderCarrito=(carrito)=>{
    $carritoContainer.innerHTML="";
    
    const $sectionCarrito=d.createElement("section");
    $sectionCarrito.classList.add("carrito");
    $carritoContainer.classList.add("carrito");
    if(carrito.length===0){
        const mensajeVacio=d.createElement("p");
        mensajeVacio.classList.add("carrito-text");
        mensajeVacio.textContent="Tu carrito esta vacio";
        $sectionCarrito.appendChild(mensajeVacio);
        $carritoContainer.appendChild($sectionCarrito);
        return;
    }

    carrito.forEach(prod=>{
        console.log(prod);
        
        //crear cinamicamente los elementos 
        //article
        const $article=d.createElement("article");
        $article.classList.add("carrito-productos");
        
        //imagen
        const $divImg= d.createElement("div");
        $divImg.classList.add("carrito-p");
        const $img=d.createElement("img");
        $img.classList.add("carrito-img");
        $img.src= prod.Img[0];
        $img.alt= prod.NombreLimpio;
        $divImg.appendChild($img);

        //mi nombre de productos 
        const $divNombre=d.createElement("div");
        $divNombre.classList.add("carrito-producto-nombre");

        const $smallTitulo=d.createElement("small");
        $smallTitulo.text="TITULO";

        const $h3Nombre=d.createElement("h3");
        $h3Nombre.textContent= prod.NombreLimpio;
        $divNombre.appendChild($smallTitulo);
        $divNombre.appendChild($h3Nombre);

        //Cantidad
        const $divCantidad = d.createElement("div");
        $divCantidad.classList.add("carrito-producto-cantidad");
        const $smallCantidad = d.createElement("small");
        $smallCantidad.textContent = "CANTIDAD";
        const $pCantidad = d.createElement("p");
        $pCantidad.textContent = prod.cantidadP;
        $divCantidad.appendChild($smallCantidad);
        $divCantidad.appendChild($pCantidad);

        
        //Precio prodcuto
        const $divPrecio=d.createElement("div");
        $divPrecio.classList.add("carrito-producto-precio")                                      
        const $smallPrecio=d.createElement("small");
        $smallPrecio.textContent="PRECIO";
        const $pPrecio=d.createElement("p");
        $pPrecio.textContent=`$${prod.Precio}`;
        $divPrecio.appendChild($smallPrecio);
        $divPrecio.appendChild($pPrecio);

        // Subtotal
        const $divSubtotal = d.createElement("div");
        $divSubtotal.classList.add("carrito-producto-subtotal");
        const $smallSubtotal = d.createElement("small");
        $smallSubtotal.textContent = "SUBTOTAL";
        const $pSubtotal = d.createElement("p");
        $pSubtotal.textContent = `$${(prod.Precio * prod.cantidadP).toFixed(2)}`;
        $divSubtotal.appendChild($smallSubtotal);
        $divSubtotal.appendChild($pSubtotal);

        // Botones
        const $divBotones = d.createElement("div");
        $divBotones.classList.add("carrito-producto-botones");
        const $btnComprar = d.createElement("button");
        $btnComprar.classList.add("boton-accion");
        $btnComprar.textContent = "comprar";
        const $btnEliminar = d.createElement("button");
        $btnEliminar.classList.add("boton-accion");
        $btnEliminar.id= prod.Id;
        $btnEliminar.textContent = "eliminar";

    

        $divBotones.appendChild($btnComprar);
        $divBotones.appendChild($btnEliminar);

        // Montar artículo
        $article.appendChild($divImg);
        $article.appendChild($divNombre);
        $article.appendChild($divCantidad);
        $article.appendChild($divPrecio);
        $article.appendChild($divSubtotal);
        $article.appendChild($divBotones);

        $sectionCarrito.appendChild($article);
    });
    
    // Sección acciones
    const sectionAcciones = d.createElement("section");
    sectionAcciones.classList.add("carrito-acciones");

    const articleAccion = d.createElement("article");
    articleAccion.classList.add("carrito-accion");

    const divImporteTxt = d.createElement("div");
    const smallImporte = d.createElement("small");
    smallImporte.textContent = "Importe Total";
    divImporteTxt.appendChild(smallImporte);

    const divImporteValor = d.createElement("div");
    const pImporte = d.createElement("p");
    const total = carrito.reduce((acc, prod)=> acc + prod.Precio * prod.cantidadP, 0);
    pImporte.textContent = `$${total.toFixed(2)}`;
    divImporteValor.appendChild(pImporte);

    const btnEliminarTodo = d.createElement("button");
    btnEliminarTodo.classList.add("eliminacionC")
    btnEliminarTodo.textContent = "Eliminar todo";
    
    

    articleAccion.appendChild(divImporteTxt);
    articleAccion.appendChild(divImporteValor);
    articleAccion.appendChild(btnEliminarTodo);

    sectionAcciones.appendChild(articleAccion);

    // Insertar todo en el main
    $carritoContainer.appendChild($sectionCarrito);
    $carritoContainer.appendChild(sectionAcciones);

};

// Evento eliminar agregando un listener al boton y dado su click eliminar
const eliminarProductosCarrito=(classCarrito, carritoArray)=>{
    d.addEventListener("click", (e) => {
    console.log(e.target);
        if(e.target.matches(classCarrito)){
            const IDboton=e.target.id;
            const index= carritoArray.findIndex(p => p.Id ===IDboton );
                if (index !== -1) {   
                
                    carritoArray.splice(index, 1);
                    localStorage.setItem("carrito", JSON.stringify(carritoArray));
                    renderCarrito(carritoArray);
                    };

                };
            
            });
    };  

//evento de eliminar todos los productos
const eliminarTodosProdcutos=(classE, carritoA )=>{
d.addEventListener("click", (e) => {
    console.log(e.target);
        if(e.target.matches(classE)){
            carritoA.splice(0, carritoA.length); //vaciar el array original
            localStorage.setItem("carrito", JSON.stringify(carritoA));
            renderCarrito(carritoA);
            

                };
            
            });
};

//obteniendo el array de agregarcarrito que percistio en local storage
let arrayAddCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

                //DOM RENDER MAIN
//carga del dom con un try catch para evitar errores globales ademas de ejecucion de funciones pertinentes que renderizan la galeria y le dan funcionalida a esta
d.addEventListener("DOMContentLoaded", async(e)=>{
    
    menuHamburguesa(".boton-menu",".boton-menu-a",".menuHamb");
    try {

        const {productosConPrecios}= await getStripeP();
        // dicha variable recibe con llave el nombre del array que retorno al final de al funcion siempre
        const {arrayFiltradoProducto} = clasificarProductos(productosConPrecios);
            //CReaNDO CONDICIONAL QUE ME PERMITE DETECTAR EN QUE HTML ESTOY

        if(d.body.id==="home"){
            $mensaje.textContent="Todos los Productos";
            renderGaleria(arrayFiltradoProducto);
                //funcion que muestra unicamente los productos clacificados
            productoFiltro(arrayFiltradoProducto,".boton-navegador");
                //funcion para aniadir productos dado el id del boton contra el id del array de productos
            botonActualizado(arrayFiltradoProducto,".add-card");
                //activar vista ampliada
            activarVistaAmpliada(".content",arrayFiltradoProducto)
        
        }else if(d.body.id==="carrito"){
            //renderizado dinamicao del carrito
            renderCarrito(arrayAddCarrito);
            //eliminar productos
            eliminarProductosCarrito(".boton-accion",arrayAddCarrito);
            //eliminar todos 
            eliminarTodosProdcutos(".eliminacionC",arrayAddCarrito);
        };
    
    } catch (error) {
    console.error("Error al cargar la tienda:", error);
    //colocar un manejo de error por si acaso
    };
});