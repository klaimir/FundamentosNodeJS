'use strict';

const mongoose = require('mongoose');

// definir un esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String] // work, lifestyle, motor y mobile
});

// creamos un método estático para procesar la entrada de datos y que pueda reutilizar listar
anuncioSchema.statics.getListado = function (req) {
    // recuperar datos de entrada
    const nombre = req.query.nombre;
    const tags = req.query.tags;
    const venta = req.query.venta;
    const precio = req.query.precio;
    // ¡¡ OJO ¡¡ : hay que recordar que todos los parámetros recibidos son string
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.start);
    const sort = req.query.sort;

    // crear filtro vacío y lo iré llenando progresivamente con los diferentes filtros
    // Esto lo hacemos así para que si no tengo nada en filtro devuelva todos
    const filtro = {};

    // Coincidencia por primera letra
    if(nombre) {
        filtro.nombre = new RegExp('^'+ req.query.nombre, "i");
    }

    // Al hacerlo así podemos tener varias formas de buscar (ver doc de la API)
    if(tags) {
        //console.log(tags);
        filtro.tags = tags;
    }

    // Convertimos a boolean
    if(venta) {
        filtro.venta = venta === 'false' ? false : true;
    }

    /*
    ○ 10-50 buscará anuncios con precio incluido entre estos valores ​ 
    { precio: { '$gte': '10', '$lte': '50' } }
    ○ 10- buscará los que tengan precio mayor que 10 ​ 
    { precio: { '$gte': '10' } }
    ○ -50 buscará los que tengan precio menor de 50 ​ 
    { precio: { '$lte': '50' } }
    ○ 50 buscará los que tengan precio igual a 50 ​ 
    { precio: '50' }
    */
    if(precio) {
        let posMenos=precio.indexOf("-");
        
        if(posMenos===-1) { // No existe: precio fijo
            filtro.precio = precio;
        } else if (posMenos===(precio.length-1)) { // Está al final: precio mayor que
            filtro.precio = { '$gte': precio.substring(0, precio.length - 1) };
        } else if(posMenos===0) { // Está al principio: precio menor que
            filtro.precio = { '$lte': precio.substring(1, precio.length) };
        } else { // Está en otra posición: rango de precios
            let rangoPrecios = precio.split("-");
            filtro.precio = { '$gte': rangoPrecios[0], '$lte': rangoPrecios[1] }
        }
        //console.log(filtro.precio);
    }

    return Anuncio.listar(filtro, limit, skip, sort);
}

// creamos un método estático separado del anterior
anuncioSchema.statics.listar = function (filtro, limit, skip, sort) {
    const query = Anuncio.find(filtro);
    query.limit(limit);
    query.skip(skip);
    query.sort(sort);
    return query.exec();
}

// creamos un método estático separado del anterior
anuncioSchema.statics.getTags = function () {
    const query = Anuncio.distinct('tags');
    return query.exec();
}

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;