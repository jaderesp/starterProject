const usuarioCtr = require('../../controllers/bd/Usuario_controller');
const util = require('../../controllers/utils/Utils_controller'); 
const extend = require('extend');

/* paginas http-front */
module.exports.index = async function(req,res){

     /* inicializar valores na pagina */
     let data = {instancia:'',qrcode:'--',status:false};
     let log = {'session':null}
     
     log.session = req.session.perfil;
    /* verificar se esta logado */
    if(log.session){ 
      /* direcionar para pagina logado e passar os dados de login */
      return res.render('usuarios/index',{'usuario':log.session, 'dados':data,'baseUrl':util.baseUrl , 'apiUrl':util.apiUrl});

   }else{
       /* retornar para login */
      return res.render('login/index',{dados:data,'baseUrl':util.baseUrl, 'apiUrl':util.apiUrl});
   }   
   
  
}

/* ger all */
module.exports.getAll = async function(req,res){

   /* dados da lista de sessões */
   let contatos = [];
   let where = {};

   let userLogged = req.session.perfil;

   /* filtrar pelo id da conta logada (usuario) */
   if(userLogged){

        let id_conta = userLogged.sessao.id_conta;  
       
       extend(where,{'id_conta':id_conta});

        contatos = await usuarioCtr.getAll(where);
        
        return res.send({'dados':contatos});

   }else{

        console.log("Usuário não logado, não foi possível realizar operação.");

        return res.send({'dados':{}});

    }

}


module.exports.get = async (req, res) => {

   let where = req.body; 
   let userLogged = req.session.perfil;

   /* filtrar pelo id da conta logada (usuario) */
   if(userLogged){ 

       let id_conta = userLogged.sessao.id_conta;  
       
       extend(where,{'id_conta':id_conta});
       
       let retorno = await usuarioCtr.get(where)

       return res.send({'dados':retorno});
       
   }else{

       console.log("Usuário não logado, não foi possível realizar operação.");

       return res.send({'dados':{}});

   }

  

}

module.exports.setup = async (req, res) => {

    let params = req.body;
   let userLogged = req.session.perfil;
   let where = {};
   let idusuario = '';

   if(params){
       if(params.idusuario){
           var id = params.idusuario;
           idusuario = id;
       }

       delete(params.idusuario);/* não atualizar chave primaria */
   }

   let retorno = false;

   /* filtrar pelo id da conta logada (usuario) */
   if(userLogged){ 

       let id_conta = userLogged.sessao.id_conta;  
       
       extend(params,{'id_conta':id_conta});
       extend(where,{'id_conta':id_conta});
       extend(where,{'idusuario':idusuario});

       retorno = await usuarioCtr.setup(params,where)

       return res.send({'retorno':retorno});

   }else{

      console.log("Usuário não logado, não foi possível realizar operação.");

      return res.send({'retorno':retorno});

  }   

}


module.exports.setupOperator = async (req, res) => {

    let params = req.body;
   let userLogged = req.session.perfil;
   let where = {};
   let idusuario = '';

   if(params){
       if(params.idusuario){
           var id = params.idusuario;
           idusuario = id;
       }

       delete(params.idusuario);/* não atualizar chave primaria */
   }

   let retorno = false;

   /* filtrar pelo id da conta logada (usuario) */
   if(userLogged){ 

       let id_conta = userLogged.sessao.id_conta;  
       
       extend(params,{'id_conta':id_conta});
       extend(where,{'id_conta':id_conta});
       extend(where,{'idusuario':idusuario});

       retorno = await usuarioCtr.setupOperator(params,where)

       return res.send({'retorno':retorno});

   }else{

      console.log("Usuário não logado, não foi possível realizar operação.");

      return res.send({'retorno':retorno});

  }   

}


module.exports.add = async (req, res) => {

   let params = req.body;
   let userLogged = req.session.perfil;

   /* filtrar pelo id da conta logada (usuario) */
   if(userLogged){ 

       let id_conta = userLogged.sessao.id_conta;  
       
       extend(params,{'id_conta':id_conta});

       let retorno = await usuarioCtr.add(params)

       return res.send({'dados':retorno});

   }else{

       console.log("Usuário não logado, não foi possível realizar operação.");

       return res.send({'dados':{}});

   }

  

}


module.exports.remove = async (req, res) => {

   let where = req.body;   

   let retorno = await usuarioCtr.remove(where)

   return res.send({'dados':retorno});

}
