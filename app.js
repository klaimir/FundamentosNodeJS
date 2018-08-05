var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { isAPI } = require('./lib/utils');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// Así puedo poner mis plantillas en extensión html
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// para servir ficheros estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Variables globales de templates
app.locals.titulo = 'NodePop';

/**
 * Conexión con la base de datos a través de Mongoose y registro de modelos
 */
require('./lib/connectMongoose');
require('./models/Anuncio')

/**
 * Rutas de mi API
 */
// Donde se tenga un método .use se le tiene que pasar un middleware y no un Objeto
// esto se debe a que no se ha exportado el módulo con module.exports = router; al final
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

/**
 * Rutas de mi aplicación web
 */
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler: lo modificamos para procesar los errores de la API de forma diferente
app.use(function(err, req, res, next) {
  // Error de validación
  if(err.array) {
    err.status = 422;
    const errorInfo = err.array({onlyFirstError:true})[0];
    err.message = isAPI(req) ? 
      { message: 'Not valid', errors: err.mapped() }
      : `Not valid - ${errorInfo.param} ${errorInfo.msg}`;
  }

  res.status(err.status || 500);

  // Identificamos si el error viene de la API para que responda un JSON y no un código HTML
  if(isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
