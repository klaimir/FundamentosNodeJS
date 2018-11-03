'use strict';

// Servicio de cambio de moneda

const cote = require('cote');

const responder = new cote.Responder({
    name: 'thumbnail generator responder'
});

var Jimp = require('jimp');

responder.on('convert', (req, done) => {
    console.log('servicio: petición de ', req.original_path, req.detination_path);

    Jimp.read(req.original_path)
        .then(img => {
            done(img
                .resize(100, 100) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write('../' + req.detination_path)); // save
        })
        .catch(err => {
            console.error(err);
        });
});