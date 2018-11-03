'use strict';

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// MIDDLEWARE que sirve para comprobar si un usuario está autenticado en una API
// Se verifica si el token JWT es válido

module.exports = function () {
    return function(req, res, next) {
        // Leer el token
        // Se va a intentar leer de varias partes
        const token = req.body.token || req.query.token || req.get('x-access-token')
        if(!token) {
            const err = new Error('no token provided');
            err.status = '401';
            next(err);
            return;
        }
        // Verificar el token
        jwt.verify(token, process.env.JWT_SECRET, (err, descodificado) => {
            if(err) {
                err.status = '401';
                next(err);               
                return;
            }
            // Añadimos esto por si queremos usarlo en cualquier otro lugar
            req.apiUserId = descodificado._id;
            // Llamar a next
            next();
        });        
    }
}