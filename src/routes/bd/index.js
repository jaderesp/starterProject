'use strict'

const usuario = require('./usuario-route');



module.exports.routes = async (app) => {

    return new Promise(async (resolve, reject) => {
        /* chamadas http-pages - front */


        /* usuarios (cadastros) */
        app.get('/usuario', usuario.index);
        app.post('/usuario/getAll', usuario.getAll);
        app.post('/usuario/add', usuario.add);
        app.post('/usuario/get', usuario.get);
        app.post('/usuario/setup', usuario.setup); /* registro de contatos para utilizar o sistema */
        app.post('/usuario/setupOperador', usuario.setupOperator);  /* cadastro de usuarios dentro do sistema (gestão de tipos de usuarios) */
        app.post('/usuario/remove', usuario.remove);


        /* webhook asaas */
        //app.post('/webhook/asaas',webHookAsaas.assasWebHook);



        resolve(app);

    });

}