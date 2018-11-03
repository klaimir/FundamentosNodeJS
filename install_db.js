'use strict';

// Librería para hacer preguntas
const readline = require('readline');

// Si no incluimos la carga de las variables de entorno da un error ya que el código de conexión
// requiree esos valores
require('dotenv').config();

const anuncios = require('./data/anuncios.json').anuncios;
const usuarios = require('./data/usuarios.json').usuarios;
const conn = require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');
const Usuario = require('./models/Usuario');

// Cuando se abra la conexión de la base de datos quiero realizar la pregunta
conn.once('open', async () => {
    try {
        const response = await askUser('Estas seguro que quieres borrar los contenidos de la base de datos nodepop? (si/no): ');

        if(response.toLowerCase() !== 'si') {
            console.log('Proceso abortado');
            process.exit();
        }

        await initAnuncios(anuncios);
        await initUsuarios(usuarios);

        // Cerrar la conexión
        conn.close();
    } catch (err) {
        console.log('Hubo un error ', err);
        process.exit(1);
    }
});

function askUser(question) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, (answer) => {
            // console.log(`Respuesta: ${answer}`);        
            rl.close();
            resolve(answer);
        });
    });
}

async function initAnuncios(anuncios) {
    console.log('init');
    // Eliminar los documentos actuales
    const deleted = await Anuncio.deleteMany();
    console.log('Eliminados ' + deleted.n + ' elementos');
    // Cargar los nuevos documentos
    const inserted = await Anuncio.insertMany(anuncios);
    console.log('Insertados ' + inserted.length + ' elementos');
}


async function initUsuarios(usuarios) {
    // Eliminar los documentos actuales
    const deleted = await Usuario.deleteMany();
    console.log('Eliminados ' + deleted.n + ' usuarios');
    // Hacer hash de las passwords
    for (let i = 0; i < usuarios.length; i++) {
        usuarios[i].password = await Usuario.hashPassword(usuarios[i].password);        
    }
    // Cargar los nuevos documentos
    const inserted = await Usuario.insertMany(usuarios);
    console.log('Insertados ' + inserted.length + ' usuarios');
}