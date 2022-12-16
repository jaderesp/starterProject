
const googleVision = require('./utils/google_visio');

module.exports.ler = async () => {

    return new Promise(async (resolve, reject) => {

        let fileName = './public/uploads/fatura-energisa.jpg';

        // let fileName = './public/uploads/comprovantes/extratos/bb.txt';

        //let base64 = "data:image/gif;base64," + fs.readFileSync(fileName, 'base64');
        //console.log(base64);
        // Creates a client











        // const [labelDetectionResult] = await client.labelDetection(fileName);

        //console.log(labelDetectionResult);

        /* const resposta = await fetch(`${process.env.OCR_API_URL}?key=${process.env.OCR_KEY}`, {
             method: 'POST',
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 requests: [{
                     image: { content: base64.toString() },
                     features: [{ type: 'TEXT_DETECTION' }]
                 }]
             })
         })
 
         const data = await resposta.json(); */

        resolve(data);



    });

}