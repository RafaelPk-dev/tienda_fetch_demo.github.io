/*export default function menuHamburguesa(botonM,botonMa,menuHamb){  



const d= document;


const renderOverlay=()=>{
    // Overlay
        const fondoBlur = d.createElement("div");
        fondoBlur.classList.add("overlay-blur");
        
        fondoBlur.appendChild(menuHamb);
        

}
d.addEventListener("click", (e)=>{
    if(e.target.matches(botonM)){
        console.log(e);    
        d.querySelector(menuHamb).classList.toggle("menuHamb-activo");
        renderOverlay();

    }
    if(e.target.matches(botonMa)){
        console.log(e);   
        d.querySelector(menuHamb).classList.remove("menuHamb-activo");
    }

});

} */ 

export default function menuHamburguesa(botonM, botonMa, menuHamb) {
    const d = document;
    let $overlay = null; // overlay solo existe mientras el menú esté abierto

    const getAside = () => d.querySelector(menuHamb);
    const abrirMenu = () => {
        const aside = getAside();
        if (!aside) return;

        // añadir clase de estado al aside
        aside.classList.add("menuHamb-activo");

        // crear overlay solo si no existe
        if (!$overlay) {
        $overlay = d.createElement("div");
        $overlay.className = "overlay-blur-aside"; // usa tu CSS existente
        // prevenir que clicks dentro del aside provoquen cierre al estar overlay encima:
        // el overlay estará insertado ANTES del aside en el DOM visual o en body y cubre todo.
        // Para permitir clicks en el aside sin que el overlay los capture, ponemos el aside con mayor z-index en CSS.
        // Si tu CSS no lo contempla, se puede mover el overlay detrás con pointer-events: auto en CSS.
        // Añadimos listener que cierra al click directamente sobre el overlay
        $overlay.addEventListener("click", (ev) => {
            if (ev.target === $overlay) cerrarMenu();
        });

        // insertar overlay en el body para cubrir todo
        document.body.appendChild($overlay);
        }

        // evitar scroll del fondo
        d.documentElement.style.overflow = "hidden";
    };

    const cerrarMenu = () => {
        const aside = getAside();
        if (!aside) return;

        aside.classList.remove("menuHamb-activo");

        // quitar overlay si existe
        if ($overlay) {
        $overlay.remove();
        $overlay = null;
        }

        // restaurar scroll
        d.documentElement.style.overflow = "";
    };

    // Inicialización: asegurar que el aside no quede con overlay creado
    // No creamos overlay hasta que se abra.

    // Delegación de clicks para abrir/cerrar
    d.addEventListener("click", (e) => {
        // abrir: botón principal (puede ser el botón con clase botonM o algún hijo)
        if (e.target.matches(botonM) || e.target.closest(botonM)) {
        // si ya está abierto, toggle: cerramos; si no, abrimos
        const aside = getAside();
        if (!aside) return;
        const abierto = aside.classList.contains("menuHamb-activo");
        if (abierto) cerrarMenu();
        else abrirMenu();
        return;
        }

        // cerrar con botón interno de cerrar
        if (e.target.matches(botonMa) || e.target.closest(botonMa)) {
        cerrarMenu();
        return;
        }

        // Si se hace click fuera del aside y el menú está abierto, también cerrar.
        const aside = getAside();
        if (aside && aside.classList.contains("menuHamb-activo")) {
        // si el click está fuera del aside y existe overlay, cerrar
        // (el overlay ya tiene su listener, pero este chequeo cubre clicks en otras partes)
        if (!e.target.closest(menuHamb)) cerrarMenu();
        }
    });

    // Cerrar con Escape
    d.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarMenu();
    });
}

