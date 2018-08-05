'use strict';

// Es buena práctica realizar un fichero de este tipo para reutilizar determinadas funciones comunes

module.exports.isAPI = function (req) {
    return req.originalUrl.indexOf('/apiv') === 0;
}
