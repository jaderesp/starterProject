'use strict'  
/* link referencias Criando APIs com NodeJs - Aula 10: CRUD REST: https://www.youtube.com/watch?v=FXQ3ZZh5jh4 */
var indexRoutes = require('./routes/index-route');

/* tornar ilimitado eventorListener da memória (para não causar estouro de memoria) */
require('events').EventEmitter.prototype._maxListeners = 0;

var app = indexRoutes.rotas();

 /* exportar -- poder usar em outro arquivo ou modulo */
 module.exports = app;


