'use strict'
const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config();


const confEnv = process.env;
const base_url = process.env.baseURL;
const api_url = process.env.API_URL;

/* fazer chamadas as rotas do proprio front (local) */
exports.postIn = async (route, params) => {

  return new Promise(async (resolve, reject) => {
    /* chamar rota */
    let url = base_url + route;

    console.log(url);
    let retorno = await axios.post(url, params)
      .then(res => {
        console.log(`statusCode: ${res.status}`);
        console.log(res.data);
        return res.data;
      })
      .catch(error => {
        console.error(error)
        return false;
      });


    if (retorno) {

      resolve(retorno);

    }


  });
}

/* utilizar para requisições na api (para backend) */
exports.sendWpp = async (route, params) => {

  var data = JSON.stringify(params);

  console.log("\r\n\r\n ==================> PARAMETROS PARA WAPI: " + route, data);

  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: api_url + route,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    let response = await axios(config)
      .then(function (response) {
        console.log("Excutando requisição na API: ", JSON.stringify(response.data));
        return response.data;
      })
      .catch(function (error) {
        console.log("Erro ao fazer a requisição na api: ", error);
        return { retorno: false, info: error };
      });
    //console.log(response);
    if (response) {
      resolve(response);
    }

  });

}

exports.zeroFill = async function (number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

/* formatar string para whatsapp <> html */
exports.setupMessage = async function (message, opt) {

  /* 
    usage:
      example: 
      setupMessage('<b>Olá bom dia, tudo bem</b>','wp'): return whatsapp format
      setupMessage('~Olá bom dia, tudo bem~','html'): return html format
  */

  return new Promise(async (resolve, reject) => {


    let _tags_html = [
      "<b>,*",
      "</b>,*",
      /* "<u>,~",
       "</u>,~", */
      "<s>,~",
      "</s>,~",
      "<em>,_",
      "</em>,_",
      "</i>,_",
      "<i>,_",
      "<strong>,*",
      "</strong>,*",
      "<br/>,\n",
      "</br>,\n",
      "<br>,\n",
      "<p>,",
      "</p>,\n",
      "<tt>,```",
      "</tt>,```",
    ];

    if (!opt) {
      resolve('');
      return;
    }


    for (var i = 0; i < _tags_html.length; i++) {

      // Separa string baseado em spaços
      let palavras = _tags_html[i].split(",");
      console.log("\r\n DADOS PARA REPLACE FORMATAÇÃO WHATSAPP: ", palavras);

      if (opt == 'wp') {

        let exist = message.indexOf(palavras[0].toString());

        if (exist !== -1 && palavras[0]) {
          var replace_ = new RegExp(palavras[0].toString(), "g");
          message = message.replace(replace_, palavras[1].toString())
        }

      } else if (opt == 'html') {

        let exist = message.indexOf(palavras[1].toString());

        if (exist !== -1) {
          if (palavras[1].toString() !== '') {

            var replace_ = '';

            if (palavras[1].indexOf('*') != -1) {
              /* se for caracteres especiais como: *, + etc add '\\' */
              replace_ = new RegExp('\\' + palavras[1].toString(), "g");
              message = message.replace(replace_, palavras[0].toString())

            } else {
              replace_ = new RegExp(palavras[1].toString(), "g");
              message = message.replace(replace_, palavras[0].toString())
            }

          }

        }

      }

    }


    resolve(message);

  });

}


/* verificar arquivo da mensagem se existe */
exports.messageFileExist = async (message) => {

  return new Promise(async (resolve, reject) => {
    if (message.mediaUrl) {

      let img = message.mediaUrl;


      if (img.indexOf('.jpeg') != -1) {

        /* verificar se é uma imagem */
        let exist = await this.fileExiste(img);

        if (exist == false) {
          img = img.replace('.jpeg', '.jpg');
          exist = await this.fileExiste(img);

          if (exist == false) {

            img = img.replace('.jpg', '.png');
            exist = await this.fileExiste(img);

            if (exist == true) {
              message.mediaUrl = img;
              resolve(message);
              return;
            }

          } else {
            message.mediaUrl = img;
            resolve(message);
            return;
          }
        } else {
          message.mediaUrl = img;
          resolve(message);
          return;
        }

      }

      if (img.indexOf('.jpg') != -1) {

        /* verificar se é uma imagem */
        let exist = await this.fileExiste(img);

        if (exist == false) {
          img = img.replace('.jpg', '.jpeg');
          exist = await this.fileExiste(img);

          if (exist == false) {

            img = img.replace('.jpeg', '.png');
            exist = await this.fileExiste(img);

            if (exist == true) {
              message.mediaUrl = img
              resolve(message);
              return;
            }

          } else {
            message.mediaUrl = img;
            resolve(message);
            return;
          }

        } else {
          message.mediaUrl = img;
          resolve(message);
          return;
        }

      }

      if (img.indexOf('.png') != -1) {

        /* verificar se é uma imagem */
        let exist = await this.fileExiste(img);

        if (exist == false) {
          img = img.replace('.png', '.jpeg');
          exist = await this.fileExiste(img);

          if (exist == false) {

            img = img.replace('.jpeg', '.jpg');
            exist = await this.fileExiste(img);

            if (exist == true) {
              message.mediaUrl = img
              resolve(message);
              return;
            }

          } else {
            message.mediaUrl = img;
            resolve(message);
            return;
          }

        } else {
          message.mediaUrl = img;
          resolve(message);
          return;
        }

      }



    }


  });

}


/* verificar se um arquivo existe */
exports.fileExiste = async function (url) {

  return new Promise(async (resolve, reject) => {


    var config = {
      method: 'get',
      url: url,
      headers: {}
    };


    try {

      axios(config).then(async function (response) {
        let result = JSON.stringify(response.data);

        if (result) {
          console.log("\r\n Retorno verificação de url: ");
          resolve(true);
          return;

        }
      })
        .catch(function (error) {

          console.log("\r\n Retorno verificação de url: ", error);
          resolve(false);
        });
    } catch (error) {

      resolve(false);
      return;

    }


  });


}


/* comparar palavras chaves recebidas
  
*/

exports.baseUrl = base_url;
exports.apiUrl = api_url;