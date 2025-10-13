// productos.js
export const clasificarProductos = (productos) => {
        const categoriasValidas = ["snack", "coctel", "cafes"];

    return productos.map((p) => {
        const palabras = p.nombre.trim().split(" ");
        const ultima = palabras[palabras.length - 1].toLowerCase();

        const categoria = categoriasValidas.includes(ultima)
        ? ultima.charAt(0).toUpperCase() + ultima.slice(1)
        : "Sin Categoria";

        const nombreLimpio = categoriasValidas.includes(ultima)
        ? palabras.slice(0, -1).join(" ")
        : p.nombre;

        return {
        Id: p.id,
        Nombre: p.nombre,
        Descripcion: p.descripcion,
        Img: p.img,
        Precio: p.precio,
        PrecioCrudo: p.precioCrudo,
        ProductoCrudo: p.productoCrudo,
        NombreLimpio: nombreLimpio,
        Categoria: categoria
        };
    });
};
