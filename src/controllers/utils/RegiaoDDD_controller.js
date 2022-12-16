'use strict'
/* teste: https://viaddd.com.br/api/ddd/16 */

const axios = require('axios');

module.exports.getDDDInfo = async (DDD) => {

    return new Promise( async (resolve, reject) => {

        if(!DDD){
            console.log("Erro, DDD inválido ou vazio.");
            resolve(false);
        }

       let regiao = await axios.get('https://viaddd.com.br/api/ddd/' + DDD)
                            .then(function (response) {
                                // handle success
                                console.log(response);
                            })
                            .catch(function (error) {
                                // handle error
                                console.log(error);
                            })
                            .then(function () {
                                // always executed
                            });


        if(regiao){

            /* 
                format object:{
                    DDD,
                    Estado,
                    Municipios[]
                }
            */
            resolve(regiao);
        }

    });

}