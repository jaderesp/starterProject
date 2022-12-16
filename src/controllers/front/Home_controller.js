/* 
    Autor: Jader Espírito Santo Silva
    data: 01/11/2021
    Whatsapp: (16) 99714-1457
    Finalidade: fornecer funçãoes para o fronte para executar rotas da api, e views do front.

*/


const util = require('../utils/Utils_controller');

module.exports.inicialize = async (req, res) => {


        let params = req.body

        if(!params.instancia){
            return false;
        }

        let retorno = await util.postIn('/wp/qrcode',params);
       
        /* chamar a page destino e enviar os dados */
        res.render('home/index',{'usuario':req.session.perfil, 'dados':retorno,'baseUrl':util.baseUrl});

}

/* logoff do usuario logado */
module.exports.logoff = async (req, res) => {

    let params = req.body

    req.session.destroy();

    let retorno = false;

          /* verificar se esta logado */
    if(req.session){        
       
         /* chamar a page destino e enviar os dados */
        res.render('home/index',{'usuario':req.session.perfil,'dados':retorno,'baseUrl':util.baseUrl});

    }else{
        /* retornar para login */
        res.render('login/index',{'baseUrl':util.baseUrl,'error':false});
    } 

   

}
