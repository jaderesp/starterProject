/* use strict */
let usuario = require('../../models/bd/Usuario_model');
const extend = require('extend');


module.exports.up = async (params) => {

    let resultado = await usuario.sync();

    console.log("Resultado do banco de dados: ", resultado);

}

module.exports.createDefaultUser = async () => {

    let params = {
        idusuario: 1,
        idcliente: 12,
        id_conta: 0000000001,
        nome: 'Administrador',
        email: 'admin@admin.com.br',
        telefone: '55 (16) 99714-1457',
        cpf: '243.060.080-37',
        login: 'admin',
        senha: 'YWRtaW4xMjM=', /* admin123 */
        descricao: 'Usuário padrão para acesso ao sistema ZapSend.'
    }

    let retorno = await usuario.createDefaultUser(params);

    console.log("Criando usuario resultado: ", retorno);
}


module.exports.get = async (where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = await usuario.get(where);

        console.log("Intent criado dados: ", retorno);
        resolve(retorno);

    });
}


module.exports.getAll = async (where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = false;

        retorno = await usuario.get(where);     

        resolve(retorno);

    })

}

module.exports.add = async (params) => {

    return new Promise(async (resolve, reject) => {

        /* converter a senha para base64 */
        if (params.senha) {

            params.senha = Buffer.from(params.senha).toString('base64');
            params.id_conta = '90000000'; /* valor temporario para ser atualizado posteriormente */

        }

        /* access_full (deafult false) */
        params.access_full = false;

        let retorno = await usuario.add(params);     

        resolve(retorno);

    });
}

module.exports.setup = async (params, where) => {

    return new Promise(async (resolve, reject) => {

        console.log("Parametros do params: \n", params);

        /* converter a senha para base64 */
        if (params.senha) {

            params.senha = Buffer.from(params.senha).toString('base64');

        }

        let retorno = await usuario.upsert(params, where);

        console.log("\r\n Dados do registro atualizado: ", retorno);

        let user = await usuario.getSomeOne({ 'email': params.email, 'id_conta': params.id_conta });

        resolve(retorno);

    });
}

module.exports.setupOperator = async (params, where) => {

    return new Promise(async (resolve, reject) => {

        console.log("Parametros do params: \n", params);

        /* converter a senha para base64 */
        if (params.senha) {

            params.senha = Buffer.from(params.senha).toString('base64');

        }


        let retorno = await usuario.upsert(params, where);

        console.log("\r\n Dados do registro atualizado: ", retorno);

        let user = await usuario.getSomeOne({ 'email': params.email, 'id_conta': params.id_conta });

      
        resolve(retorno);

    });
}


module.exports.remove = async (where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = await usuario.remove(where);

        console.log("Intent criado dados: ", retorno);
        resolve(retorno);

    });
}