/* rotas para front home */
const home = require('../../controllers/front/Home_controller');
const util = require('../../controllers/utils/Utils_controller');  

/* paginas http-front */
module.exports.front = async function(req,res){

     /* inicializar valores na pagina */
     let data = {instancia:'',qrcode:'--',status:false};
     let log = {'session':null}
     
     log.session = req.session.perfil;
    /* verificar se esta logado */
    if(log.session){ 
      /* direcionar para pagina logado e passar os dados de login */
      return res.render('home/index',{'usuario':log.session, 'dados':data,'baseUrl':util.baseUrl, 'apiUrl':util.apiUrl });

   }else{
       /* retornar para login */
      return res.render('login/index',{dados:data,'baseUrl':util.baseUrl,'error':false});
   }   
   
  
}


module.exports.inicialize = async (req,res) => {

    
    let retorno = false;
 
     /* verificar se esta logado */
     if(req.session.perfil){ 

        retorno = await home.inicialize(req, res);

    }else{
        /* retornar para login */
        return res.render('login/index',{'baseUrl':util.baseUrl, 'apiUrl':util.apiUrl});
    } 
 
    return retorno;

}

module.exports.logoff = async (req, res) => {

    let retorno = false;

      
    retorno = await home.logoff(req, res);


    return retorno;

}