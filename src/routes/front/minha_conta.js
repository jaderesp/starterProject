/* rotas para front home */
const home = require('../../controllers/front/Conta_controller');
const util = require('../../controllers/utils/Utils_controller');  
const asaas = require('../../controllers/asaas/cliente_controller');

/* paginas http-front */
module.exports.conta = async function(req,res){
   
      /* inicializar valores na pagina */
      let data = {instancia:'',qrcode:'--',status:false};
      let log = {'session':null}
      
      log.session = req.session.perfil;
      console.log(log);
     /* verificar se esta logado */
     if(log.session){
        
       /* direcionar para pagina logado e passar os dados de login */
       return res.render('minha_conta/index',{'usuario':log.session, 'dados':data,'baseUrl':util.baseUrl, 'apiUrl':util.apiUrl });
 
    }else{
        /* retornar para login */
       return res.render('login/index',{dados:data,'baseUrl':util.baseUrl, 'apiUrl':util.apiUrl});
    }   
    
  
}