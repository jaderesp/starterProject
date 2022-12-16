const db = require("../../config/postgresql");
const dotenv = require('dotenv');
dotenv.config();


const apikey = process.env.ACCESS_APIKEY;



  /* validar informações */
  exports.login = async (params) =>{

    /* 
        parametros:
        params:
            token (token para validação de login)
    */

    return new Promise( async (resolve, reject) => {
        let auth = false;

        try{    

            params = JSON.parse(JSON.stringify(params)).senha;
            
           
            if(!params.senha){
                resolve(auth);
            }

            if(!params.senha){
                resolve(auth);
            }
                    
            let response = undefined;
            console.log(params.usuario)
            try{
                response = await db.query('SELECT * FROM usuario WHERE login = $1 ', [params.usuario]);
            }catch(error){

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);

            }
            
            let dados = response.rows;            
            
            if(dados.length == 0){
                auth = false;
            }

            /* decodificar senha e comparar com senha informada */
            let senha = dados[0].senha;
            let data = senha;
            let buff = new Buffer.from(data, 'base64');
            senha = buff.toString('ascii');
           
            /* verificar se a senha */
            if(params.senha == senha){
                auth = true;
            }else{
                auth = false;
            }

            resolve({'login':auth,'sessao':dados[0]}); /* retornar login e dados da sessão */

        }catch(error){
            resolve(false);
        }


    });


  }