

class Atendimento{
        antendimento;

        constructor(){

                this.atendimento = {}; /* dados do atendimento */

        }


        async setAcaoAtendimento(params, action){

            /* 
                    params: 
                        action = ATENDER, RESTOMNAR, TRANFERIR OU FECHAR (atendimento)
                        PARAMS = idContato (atendente), id_ticket (atendimento), 
            
            */
                
        
                return new Promise( async (resolve, reject) => {

                    if(!params){
                        console.log("\r\n Os parametros do atendimento estão vazios.");
                        resolve(false);
                        return;
                    }

                    if(!action){
                        console.log("\r\n Informe o status do atendimento.");
                        resolve(false);
                        return;
                    }

                    /* verificar se já tem dados relacionais resgatar, alterar e atualizar */                    
                    let result = await this.postIn(params,'atendimento/setup');   
                    
        
                      resolve(result);
        
                });
        
        }


        async postIn(params, route){

            return new Promise( async (resolve, reject) => {
        
                let retorno = false;
                let url_ = '';
        
                if(!params){
                  console.log("\r\n informe os parametros para a ação.");
                  resolve(false);
                  return;
                }
        
                if(!route){
                  console.log("\r\n informe qual ação deseja realizar para requisição post.");
                  resolve(false);
                  return;
                }else{

                    url_ = base_url + route;         
                   
                }
        
        
                try{
                      
                    const response = await axios.post(url_,params);
                    const retorno = response.data.retorno;
        
        
                    resolve(retorno);
                    return;
        
        
                  }catch(erro){
        
        
                    console.log("\r\n OoOps ocorreu um erro na requisição http.", erro);
                    resolve(false);
                    return;
                    
                  }
        
        
            });
        }


}