'use strict';

const multer = require('multer');
const path = require('path');

// Multer upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Aquí podría elegir la ruta dinamicamente donde guardarlo
        cb(null, path.join(__dirname, '..', 'public/images/anuncios'));
    },
    // Si no ponemos esta opción, subirá los ficheros con un nombre aletorio para impedir colisiones de nombres
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

module.exports = multer({ storage: storage });