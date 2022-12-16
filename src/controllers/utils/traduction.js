'use strict'
const translate = require('@iamtraction/google-translate');

exports.traduzir = async (text,lang) => {

    return new Promise( async (resolve, reject) => {

        if(!text){
            resolve('');
            return;
        }

        if(!lang){
            resolve('');
            return;
        }


        translate(text, { to: lang }).then(res => {

            console.log("\r\nTradução relaizada: " + res.text); // OUTPUT: You are amazing!
            resolve(res.text);
        
        }).catch(err => {

            console.error("\r\nOcorreu um erro ao realizar tradução: ",err);
            resolve('');

        });


    });

}