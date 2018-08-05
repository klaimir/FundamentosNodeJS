'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

conn.on('error', err => {
    console.error('Error de conexión', err);
    // No tiene sentido mantener una aplicación funcionando si no puede conectar a la BD
    process.exit(1);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB en', conn.name);
});

// Podriamos ponerlo así pero es mejor ponerlo en una variable de entorno reutilizable
// para tener los datos de conexión localizados
// mongoose.connect('mongodb://localhost:27017/nodepop', { useNewUrlParser: true });
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING, { useNewUrlParser: true });

// Esto no es ncesario ponerlo
module.exports = conn;