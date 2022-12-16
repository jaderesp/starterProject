'use strict'
const session = require('../../models/bd/Usuario_model');
const util = require('../utils/Utils_controller')
const base_url = util.baseUrl;

/* autenticação do usuario */
exports.login = async function(senha){

    return new Promise( async (resolve, reject) => {

        let params = {'senha':senha,'baseUrl':base_url};
        let result = await session.login(params);

        resolve(result);

    });

}
/* validar se conta existe */
exports.validar = async function(where){

    return new Promise( async (resolve, reject) => {
        
        let result = await session.get(where)

        resolve(result);

    });

}