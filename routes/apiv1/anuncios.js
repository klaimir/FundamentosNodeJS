'use strict';

var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const Anuncio = require('../../models/Anuncio');

/**
 * GET /
 * Retorna una lista de anuncios 
 */
router.get('/', async (req, res, next) => {
    try {
        const anuncios = await Anuncio.getListado(req);

        res.json({ success: true, result: anuncios });
    } catch (err) {
        next(err);
    }    
});

/**
 * GET /tags
 * Retorna la lista de tags introducidos
 */
router.get('/tags', async (req, res, next) => {
    try {
        const tags = await Anuncio.getTags();

        res.json({ success: true, result: tags });
    } catch (err) {
        next(err);
    }    
});

/**
 * POST /
 * Crea un anuncio en la colección
 */
router.post('/', async(req, res, next) => {
    try {
        //console.log(req.body);
        const datosAnuncio = req.body;

        // crear un anuncio en memoria
        const anuncio = new Anuncio(datosAnuncio);

        // guardarlo en la base de datos
        const anuncioGuardado = await anuncio.save();

        res.json({ success: true, result: anuncioGuardado });
    } catch (err) {
        next(err);
    }    
});

module.exports = router;