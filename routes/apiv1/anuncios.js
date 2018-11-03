'use strict';

var express = require('express');
var router = express.Router();

const Anuncio = require('../../models/Anuncio');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');

const jwtAuth = require('../../lib/jwtAuth');

const upload = require('../../lib/uploadConfig');

// var Jimp = require('jimp'); // si deseamos hacerlo directamente descomentar

const cote = require('cote');

const requester = new cote.Requester({
    name: 'thumbnail generator requester'
});


router.post('/authenticate', async (req, res, next) => {
    try {
        // recoger parámetros del cuerpo de la petición
        const email = req.body.email;
        const password = req.body.password;

        //buscar el usuario
        const usuario = await Usuario.findOne({
            email: email
        });
        if (!usuario || !await bcrypt.compare(password, usuario.password)) {
            res.json({
                success: false,
                error: 'Invalid credentials'
            })
            return;
        }
        // usuario encontrado y password ok
        // no meter instancias de mongoose en el token!
        jwt.sign({
            _id: usuario._id
        }, process.env.JWT_SECRET, {
            expiresIn: '20s'
        }, (err, token) => {
            if (err) {
                next(err);
                return;
            }
            res.json({
                success: true,
                token: token
            });
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /
 * Retorna una lista de anuncios 
 */
router.get('/', jwtAuth(), async (req, res, next) => {
    try {
        const anuncios = await Anuncio.getListado(req);

        res.json({
            success: true,
            result: anuncios
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /tags
 * Retorna la lista de tags introducidos
 */
router.get('/tags', jwtAuth(), async (req, res, next) => {
    try {
        const tags = await Anuncio.getTags();

        res.json({
            success: true,
            result: tags
        });
    } catch (err) {
        next(err);
    }
});

/**
 * POST /
 * Crea un anuncio en la colección
 */
router.post('/', jwtAuth(), upload.single('imagen'), async (req, res, next) => {
    try {
        let datosAnuncio = req.body;
        // Introducimos la ruta del fichero como parte de los datos a persistir
        datosAnuncio.foto=req.file.filename;

        // crear un anuncio en memoria
        const anuncio = new Anuncio(datosAnuncio);

        // guardarlo en la base de datos
        const anuncioGuardado = await anuncio.save();

        // Llamamos al servicio para generar el thumbnail
        requester.send({
            type: 'convert',
            original_path: req.file.path,
            detination_path: 'public/images/anuncios/thumbnail-' + req.file.filename
        }, res => {
            console.log('imagen creada ', res);
        });

        // Si quisieramos hacerlo directamente, lo pondriamos así
        /*
        Jimp.read(req.file.path)
        .then(img => {
            return img
            .resize(128, 128) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write('public/images/anuncios/thumbnail-' + req.file.filename); // save
        })
        .catch(err => {
            console.error(err);
        });
        */

        res.json({
            success: true,
            result: anuncioGuardado
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;