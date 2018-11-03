'use strict';

const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {
    // Establecemos la cookie para el idioma recibido
    const locale = req.params.locale;
    console.log(locale);

    // Guardar a la página a la que hay que volver
    const backTo = req.header('Referer');

    // Establecemos la cookie del nuevo idioma
    // El tiempo de expiración es orientativo
    res.cookie('nodeapi-lang', locale, { maxAge: 1000*60*60*24*14 })

    // Redirigimos al usuario a donde estaba
    res.redirect(backTo);
});

module.exports = router;