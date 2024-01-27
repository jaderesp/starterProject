"use strict"
const vision = require('@google-cloud/vision');
const fs = require('fs');
const jsonAuth = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fetch = require("node-fetch");
const projectId = process.env.PROJECT_ID;


module.exports.getImageData = async (imageDir) => {

    return new Promise(async (resolve, reject) => {

        const client = new vision.ImageAnnotatorClient({
            keyFilename: jsonAuth /* config json google auth */
        });

        var data = {};

        client.labelDetection(imageDir)
            .then((results) => {

                const labels = results[0];

                console.log("\r\n Labels: ", labels);

                labels.forEach((label) => console.log("\r\n dados da label: ", label.desciption));

                data = labels;

            }).catch((err) => {

                console.log("\r\n Erro ao realizar leitura da imagem: ", err);

            })

        resolve(data);

    });

}