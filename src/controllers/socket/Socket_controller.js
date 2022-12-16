'use strict'
var Spinnies = require("spinnies");
/* chamar router/funcoes responsáveis por retornar notificações */


  /* configurar socket.io */
  var spinnies = new Spinnies();


  /* classe para chamada do socket nomeada pela identificação de cada sessão (cliente) */
  exports.inicialize = async (socket) => {   

    return new Promise( async (resolve, reject) => {
             

                socket.on('connection', async (socket) => {

                        spinnies.add('server-screen-socket', { text: 'Socket frontEnd Iniciado: cliente: id: '+ socket.id +' rodando...', color: 'blue' });
                
                        /* chamada do cliente para api  -  Cliente ----> API */
                        socket.on('getNotification', async data => {
                        
                        console.log(" Dados recebidos do front: (Socketio) ",data);  
                           // var instanciaInfo = await notifis.instanceInfoSocketIo(data.instancia);
                            return data;
                        });
                
                        
                });


                resolve(socket);
        
        });
    


  }


  /* enviar dados para o client socketio */
  exports.send = async (socket,nameCall ,params) => {

    return new Promise( async (resolve, reject) => {

        if(!socket){
            resolve(false);
        }

        if(!params){
            resolve(false);
        }

        if(!nameCall){
            resolve(false);
        }

        let res = socket.emit(nameCall,params);

        if(res){
            resolve(true);
        }

    })

  }

  

