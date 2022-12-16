const { Sequelize } = require('sequelize');
const database = require('../../../config/sequelize');
 
let usuario = database.define('Usuario', {
    idusuario: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idcliente: Sequelize.INTEGER,
    id_conta: {
        type:Sequelize.INTEGER.ZEROFILL,        
        allowNull: false
    },
    owner_id: {
        type:Sequelize.INTEGER.ZEROFILL,        
        allowNull: true /* se for usario atendente owner é a conta do seu administrador */
    },
    foto: Sequelize.BLOB,
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING, /* jaderesp@gmail.com */
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING, 
        allowNull: false
    },    
    login: Sequelize.STRING, /* jaderesp */
    senha: Sequelize.TEXT, /* base64: bHVpc0AxMjMzMjE=       to String = luis@123321 */
    descricao: Sequelize.STRING,
    type_user: {
        type: Sequelize.STRING, 
        allowNull: false,
        defaultValue: 'owner', /* dono da conta */
    },
    access_full: {
        type: Sequelize.STRING, 
        allowNull: true,
        defaultValue: 'false',
    },
     
    // Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});
 
module.exports.sync = async () => {

    try {
        const resultado = await database.sync({force: true});        
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
    

}

module.exports.createDefaultUser = async (params) => {

     if(!params){
         console.log("Erro, não existem dados de paramentros para esta tarefa.")
         return false;
     }

    try {
        const resultadoCreate = await usuario.create(params);
        console.log("Resultado criação de usuário padrão: ",resultadoCreate);

        return resultadoCreate;

    } catch (error) {
        console.log("Ocorreu um erro ao criar o usuário padrão: ",error);

         /* forçar criação da tabela caso não exista */
        let res = await usuario.sync();

        if(res){
           console.log("✅ Por precaução, Forçamos a criação da tabela de usuario.", res); 
        }

        return false;
    }

}


/* login de usuario */
module.exports.login = async function(params){

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
            console.log(params.email)
            try{ 
                response = await usuario.findOne({where:{'email':params.email}});
            }catch(error){

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);

            }
            
            let dados = response.dataValues;            
           
            if(dados.length == 0){
                auth = false;
            }

            /* decodificar senha e comparar com senha informada */
            let senha = dados.senha;
            let data = senha;
            let buff = new Buffer.from(data, 'base64');
            senha = buff.toString('ascii');
           
            /* verificar se a senha */
            if(params.senha == senha){
                console.log("👍Usuário logado com sucesso.",dados.login)
                auth = true;
            }else{
                auth = false;
            }

            resolve({'login':auth,'sessao':dados}); /* retornar login e dados da sessão */

        }catch(error){
            resolve(false);
        }


    });

}




    
/* add or update */
module.exports.upsert = async (params,where) => {

    if(!params){
        console.log("Erro, não existem dados de paramentros para esta tarefa.")
        return false;
    }

   try {
        let result = false;
       
        if(!where){
           return false;
        }

        const foundItem = await usuario.findOne({where});
        if (!foundItem) {
            // Item not found, create a new one
            result = await usuario.create(params)
            return  result;
        }
        // Found an item, update it
        result = await usuario.update(params, {where});

       return result;

   } catch (error) {
       console.log("Ocorreu um erro ao criar o contato: ",error);

        /* forçar criação da tabela caso não exista */
       let res = await usuario.sync();

       if(res){
          console.log("✅ Por precaução, Forçamos a criação da tabela de usuario.", res); 
       }

       return false;
   }

}

module.exports.add = async (params) => {

    if(!params){
        console.log("Erro, não existem dados de paramentros para esta tarefa.")
        return false;
    }

   try {
       const resultadoCreate = await usuario.create(params);
      // console.log("Resultado criação de contato: ",resultadoCreate);

       return resultadoCreate;

   } catch (error) {
       console.log("Ocorreu um erro ao criar o contato: ",error);

        /* forçar criação da tabela caso não exista */
       let res = await usuario.sync();

       if(res){
          console.log("✅ Por precaução, Forçamos a criação da tabela de Intent.", res); 
       }

       return false;
   }

}


/* login de usuario */
module.exports.getAll = async function(){

    return new Promise( async (resolve, reject) => {
        let retorno = false;

        try{ 
                    
            let response = undefined;

            try{ 
                response = await usuario.findAll({order: [ ['updatedAt',  'DESC'] ] });
            }catch(error){

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);
                return false;

            }
            
            let dados = response;           
//console.log("ordem das mensagens: ", dados);
            resolve(dados); /* retornar login e dados da sessão */

        }catch(error){
            resolve(false);
        }


    });


}


/* get contato */
module.exports.get = async function(where_){

    return new Promise( async (resolve, reject) => {
        let retorno = false;

        try{   

            if(!where_){
                resolve(retorno);
            }
                    
            let response = undefined;

            try{ 
                response = await usuario.findAll({where:where_});
            }catch(error){

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);

            }
            
            let dados = response;           

            resolve(dados);

        }catch(error){
            console.log("Ocorreu um erro ao realizar a consulta de contato: ", error);
            resolve(false);
        }


    });


}

module.exports.getSomeOne = async function(where_){

    return new Promise( async (resolve, reject) => {
        let retorno = false;

        try{   

            if(!where_){
                resolve(retorno);
            }
                    
            let response = undefined;

            try{ 
                response = await usuario.findAll({where:where_});
            }catch(error){

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);

            }
            
            let dados = []; 
            
            if(response[0]){
                dados = response[0].dataValues; 
            }       

            resolve(dados);

        }catch(error){
            console.log("Ocorreu um erro ao realizar a consulta de contato: ", error);
            resolve(false);
        }


    });


}

/* add or update */
module.exports.update = async (params,where) => {

    if(!params){
        console.log("Erro, não existem dados de paramentros para esta tarefa.")
        return false;
    }

   try {
        let result = false;
       
        if(!where){
           return false;
        }
        // Found an item, update it
        result = await usuario.update(params, {where});

       return result;

   } catch (error) {
       console.log("Ocorreu um erro ao criar o contato: ",error);

        /* forçar criação da tabela caso não exista */
       let res = await usuario.sync();

       if(res){
          console.log("✅ Por precaução, Forçamos a criação da tabela de usuario.", res); 
       }

       return false;
   }

}

/* remover */
module.exports.remove = async (where_) => {

    if(!where_){
        console.log("Erro, é preciso informar parametros de seleçãodo registro para realizar exclusão do registro.")
        return false;
    }

   try {
       const resultado = await usuario.destroy({
            where:where_
       });
    
       return resultado;

   } catch (error) {

       console.log("Ocorreu um erro ao atualizare o registro: ",error);

       return false;
   }

}


