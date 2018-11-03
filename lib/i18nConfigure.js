'use strict';

const i18n = require("i18n");
const path = require('path'); // Al usar el método join nos abstrae del formato de la ruta en los diferentes SO

module.exports = function () {

    // Este configurador sirve para informar a Express
    i18n.configure({
        locales: ['en', 'es'],
        directory: path.join(__dirname,'../locales'),
        defaultLocale: 'es',
        autoReload: true,
        cookie: 'nodeapi-lang', // Usaremos locale de esta cookie para que ignore lo que diga la cabecera de las peticiones por defecto
        syncFiles: true // Mejor activar esto, ya que, si no existe el item requerido lo crea en todos los idiomas
    });

    i18n.setLocale('es'); // Locale por defecto para scripts

    return i18n;

}