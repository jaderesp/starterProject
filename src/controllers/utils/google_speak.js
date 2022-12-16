// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');

const dotenv = require('dotenv');
const { Console } = require('console');
dotenv.config();
  
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

exports.textToVoice = async function(params) {

    return new Promise( async (resolve, reject) => {
        // The text to synthesize
       // const text = 'Olá bom dia tudo bem?';

        // Construct the request
        /* GERAR E TESTAR CONFIGURAÇÕES JSON: https://cloud.google.com/text-to-speech 
        
            GERIR CUSTOS: https://console.cloud.google.com/apis/api/texttospeech.googleapis.com/cost?project=jmsoft-1528635919950

        */

            if(!params.text){
                resolve(false);
                return;
            }

            if(!params.contatoId){
                resolve(false);
                return;
            }
            

        const request = {    
            "audioConfig": {
                "audioEncoding": "MP3",
                "effectsProfileId": [
                "large-automotive-class-device"
                ],
                "pitch": -2.8,
                "speakingRate": 1.07
            },
            "input": {
                "text": params.text
            },
            "voice": {
                "languageCode": "pt-BR",
                "name": "pt-BR-Standard-A"
            }
        };

        try{
            // Performs the text-to-speech request
            const [response] = await client.synthesizeSpeech(request);
            // Write the binary audio content to a local file
            const writeFile = util.promisify(fs.writeFile);

            console.log("conteudo audio: ", response);

            await writeFile('./public/files/voices/notify_' + params.contatoId + '.mp3', response.audioContent, 'binary');

            resolve({fileDir:'files/voices/notify_' + params.contatoId + '.mp3'});
            return;

        }catch(error){

            console.log("\r\n Erro ao processar audio de voz: ", error);
            resolve(false);

        }

    });
  //console.log('Audio content written to file: output.mp3');
}
