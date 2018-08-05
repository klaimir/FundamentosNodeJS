var express = require('express');
var router = express.Router();

const Anuncio = require('../models/Anuncio');

/**
 * Home: página inicial
 * Listado de anuncios con filtros
 */

router.get('/anuncios', async (req, res, next) => {
  try {
      const anuncios = await Anuncio.getListado(req);

      res.render('index', { anuncios: anuncios });
  } catch (err) {
      next(err);
  }    
});

module.exports = router;
