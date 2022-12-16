'use strict'

const reader = require('./ReaderFiles-route');



module.exports.routes = async (app) => {

    return new Promise(async (resolve, reject) => {
        /* chamadas http-pages - front */


        /* usuarios (cadastros) */
        app.post('/leitura', reader.ler);


        resolve(app);

    });

}