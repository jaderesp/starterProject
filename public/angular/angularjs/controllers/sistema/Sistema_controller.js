jms_app.controller('Sistema_controller', ['$scope','$window','$http','$timeout','$interval','$location','$filter', '$ngConfirm','DTOptionsBuilder', 'DTColumnBuilder','DTColumnDefBuilder', async function($scope,$window, $http,$timeout,$interval,$location,$filter,$ngConfirm,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){
    /* 
        - verificação de conexão do api (se servidor ativo ou inativo)
        - verificar status e notificações das sessões
    */
    $scope.base_url = $("#baseUrl").val() + "/";
    $scope.api_url = $("#apiUrl").val();
    $scope.ownerId = $('#ownerID_sis').val();

    $scope.sessions_list = [];
    $scope.contatos_list = [];

    /* notificações */
    $scope.notificaoes = [];
    /* notificações */
    $scope.traduzirConn = [{
        'online':[
            'inChat',
            'synchronized',
            'true'
        ],
        'offline':[
            'UNPAIRED',
            'TIMEOUT',
            'false',
            'false'
        ]
    }];

    $scope.notifyCount = {
            'online':0,
            'offline':0
        };
    

    /* controle autoresponder */
    $scope.flagAutor = 'false';

    /* servidor status */
    $scope.serverApi = 'offline';


    /* sons de notificação */
    let newMsgMp3 = "notifyNewMsg";
    let newMsgMpGroup = "notifyNewMsgGroup";

    $scope.loadSound = function() {        
      
            createjs.Sound.registerSound("../../files/notificacoes/newmsg.mp3", newMsgMp3);    
            createjs.Sound.registerSound("../../files/notificacoes/msn-notif.mp3", newMsgMpGroup);
    }

    $scope.playSound = function(type){        

        if(type == 'grupo'){
            createjs.Sound.play(newMsgMpGroup);   
        }else{
            createjs.Sound.play(newMsgMp3);
        }       

    }


    /* verificação de conexão com API e status de sessões */
    $scope.verifyService = async function(){

        return new Promise( async (resolve, reject) => {

              
               let interv = $interval(async function(){

                    $scope.notifyCount.online = 0;
                    $scope.notifyCount.offline = 0;

                    /* verificar conexao com API (servidor) */
                    
                    

                    /* verificar status de sessões */
                    for(var i =0; i < $scope.sessions_list.length; i++){

                          let retorno = await $scope.getStatusSessionApi($scope.sessions_list[i].nomeApi_sess);

                          if(retorno){
                          
                            $scope.sessions_list[i].status_sess = retorno.status;

                            /* contabilizar offline e online */
                            await $scope.setNotificar(retorno);
                             
                          }                        

                    }

                    /* verificar se servidor esta online */
                   let status = await $scope.checkOnline($scope.api_url);                   
                 
                   $scope.verifyLogged();
                     //$interval.cancel(interv);

                },10000)

        });



    }


    /* consulta status da sessão */
    $scope.getStatusSessionApi = async function(sessionName){

            return new Promise( async (resolve, reject) => {

                        $http({
                            headers: {
                                "Content-Type": "application/json"
                            },
                            method:'POST',
                            url: $scope.api_url + '/wp/status',
                            data:JSON.stringify({"instancia":sessionName})
                        }).then(async function(data){
                            var result;                   
                            result = data.data;                            

                            resolve(result);            
                                        
                        });

            });

    }

    /* listar todas as sessões */       
    $scope.get_sessions = async function(id){

        var opcao = {'id':id};
       
        $http({
            method:'POST',
            url: $scope.base_url + "sessao/getAll",
            data:opcao
        }).then( async function(data){
            var result;                   
            result = data.data.dados;

            console.log("lista de sessões", result);
            $scope.sessions_list = [];
            $scope.sessions_list = result;

            $scope.notifyCount = {
                'online':0,
                'offline':$scope.sessions_list.length
            };

        });
        

    }

     /* listar contatos */
     $scope.get_contatos = async function(id){

        var opcao = {'id':id};
       
        $http({
            method:'POST',
            url: $scope.base_url + "contatos/getAll",
            data:opcao
        }).then( async function(data){
                var result;                   
                result = data.data.dados;

                console.log("lista de contatos: ", result);
                $scope.contatos_list = [];
                $scope.contatos_list = result;
               

        });
        

    }

    /* verificar se servidor está no ar */
    $scope.checkOnline = function (url_, error, ok) {

        return new Promise( async (resolve, reject) => {      

            $.ajax({
               url: url_ + '/wp/ping',
               success: function(result){
                  console.log("Servidor " + url_ + " está online." );
                  $scope.serverApi = 'online';
                  resolve(true);
               },     
               error: function(result){
                console.log("Servidor " + url_ + " está offline." );
                $scope.serverApi = 'offline';
                resolve(false);
               }
            });         

        })
    };

    /* =============================== SCOKET IO ==================================== */

    $scope.initSocketIoAll = async function(){


        /* socket io */
        $scope.socketAll = io($scope.api_url, {transports: ['websocket', 'polling', 'flashsocket'], autoConnect: true});
        $scope.socketAll.on("disconnect", () => { 
    
            console.log("Erro, o servidor da api não está online, favor verifique.");
            
        });
    
        $scope.socketAll.on('qrcode' + $scope.ownerId, async function (data) {
            data = angular.fromJson(data); /* converter string to object */
          //  console.log("Informação recebida (qrcode): ",data);

          
        });

        $scope.socketAll.on('sessionStatus' + $scope.ownerId, async data => {

            data = angular.fromJson(data); /* converter string to object */
            console.log("Status da sessão via socket: ", data);
            
            $scope.get_sessions();/* atualizar informações de sessão */

           
        });


    
        $scope.socketAll.on('notificacao' + $scope.ownerId, async function (data) {

            data = angular.fromJson(data);
          //  console.log("Nova notificação: ",data);         
            
        
        });

        $scope.socketAll.on('onAck' + $scope.ownerId, async (data) => {

            /* atualizar em tempo real no front = status da mensagem: lida, recebida etc... */

            let ackSocket = {};
            data = angular.fromJson(data);
            ackSocket = angular.fromJson(data.ack);
         //   console.log("Nova ocorrência na mensagem: ", ackSocket);

            

        })
    
        
        $scope.socketAll.on('receivedMessage' + $scope.ownerId, async function (data) {

            data = angular.fromJson(data);
          //  console.log("Mensagem recebida: ",data);   

                var number = data.msg.sender.id;

                
                if(data.msg.fromMe == false){                    
                    
                    if(data.msg.isGroupMsg == false){
                        /* tocar som de notificação */
                        $scope.playSound();              
                    
                    }else if(data.msg.isGroupMsg == true){

                        $scope.playSound('grupo'); 

                    }

                }
                


                
                let info = {
                    nome:'',
                    pic:''
                };
                
                /* registrar notificação de nova mensagem para o contato */
                for(var i = 0;i < $scope.contatos_list.length;i++){

                    let id_ = $scope.contatos_list[i].number.replace(/\D/g, '');

                  

                        if(id_ == number.replace(/\D/g, '')){

                           
                            
                             /* abrir popup de notificação */
                            var nome = $scope.contatos_list[i].nome;
                            var mensagem = data.msg.body;

                            /* verificar se a mensagem é uma arquivo */
                            if(data.msg.mimetype){
                                let fileTypeArr =  data.msg.mimetype.split('/');
                                mensagem = " 📁: Enviou arquivo: " + fileTypeArr[0] + " formato: " + fileTypeArr[1] + ".";
                            }

                            if(!mensagem){
                                mensagem = '';
                            }else{

                               info.pic = $scope.contatos_list[i].profilePic;
                               //notifyName
                               if(data.msg.notifyName){

                                info.nome = data.msg.notifyName;

                               }else{

                                info.nome = $scope.contatos_list[i].nome;

                               }
                               
                            }

                            /* exibir modal nova mensagem apenas se for dos contato (não minha proprias mensagens) */
                            if(data.msg.fromMe == false){
                                var icon = '<a href="chat"><span class="avatar"><img class="round" src="'+ info.pic +'" alt="avatar" width="40" height="40"><span class="avatar-status-online"></span></span></a>';
            
                                /* notificação modal nova mensagem */
                                // Remove current toasts using animation
                                //toastr.clear()´

                                /* formatar mensagem de whatsapp para html  */
                                mensagem = await $scope.setupMessageFormat(mensagem,'html');

                                toastr.remove();
                                toastr.options.positionClass = 'toast-bottom-right';                            
                                toastr.success( mensagem, icon + ' ' + info.nome + ' diz:' , {
                                    closeButton: !0,
                                    tapToDismiss: !2,
                                    newestOnTop:false
                                });
                            }
                                
                           

                            break;
                           

                        }                        
                   
                }


               
        });

        cont = 0;

    }

    /* configurar dados de notificações */
    $scope.setNotificar = async (retorno) => {

        return new Promise( async (resolve, reject) => {

             /* contabilizar offline e online */
             switch (retorno.status){
                case 'PAIRED':
                    $scope.notifyCount.online++;
                    break;
                case 'CONNECTED':
                    $scope.notifyCount.online++;
                    break;
                case true:
                    $scope.notifyCount.online++;
                    break;
                case 'UNPAIRED':
                    $scope.notifyCount.offline++;
                    break;
                case 'DISCONECTED':
                    $scope.notifyCount.offline++;
                    break;
                default:
                    $scope.notifyCount.offline++;
            }


            resolve(true);

        });
             
    }         

 


    /* controle do autoresponder */
     /* listar todas as sessões */       
     $scope.setupAutoresponder = async function(){

        return new Promise( async (resolve, reject) => {          

            var opcao = {'status': $scope.flagAutor};
        
            $http({
                method:'POST',
                url: $scope.base_url + "autoresponder/setStatus",
                data:opcao
            }).then( async function(data){
                var result;                   
                result = data.data.retorno;

                console.log("Resultado da alteração de status autoresponder.", result);
               
               if(result == false){

                    $scope.flagAutor = 'false';

                }
                

            });

        });
        

    }

    /* retornar status atual do autoresponder no BD */
    $scope.getStatusAutoresp = async function(){

        return new Promise( async (resolve, reject) => {

            var opcao = {'status': $scope.flagAutor};
        
            $http({
                method:'POST',
                url: $scope.base_url + "autoresponder/getStatus",
                data:opcao
            }).then( async function(data){
                var result;                   
                result = data.data.dados;

                console.log("Resultado da consulta de status autoresponder.", result);
               
                if(result.length){

                    if(result[0].status){
                        $scope.flagAutor = result[0].status.toString();
                    }else{
                        $scope.flagAutor = 'false';
                    }

                }else{

                    $scope.flagAutor = 'false';

                }
               

            });

        });
        

    }

    $scope.setupMessageFormat = async function(message,opt){

        /* 
          usage:
            example: 
            setupMessage('<b>Olá bom dia, tudo bem</b>','wp'): return whatsapp format
            setupMessage('~Olá bom dia, tudo bem~','html'): return html format
        */
      
            return new Promise( async (resolve, reject) => {
      
               
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
      
                  if(!opt){
                          resolve('');
                          return;
                  }
      
      
                  for(var i = 0; i < _tags_html.length; i++){
      
                          // Separa string baseado em spaços
                          let palavras = _tags_html[i].split(",");
      
      
                          if(opt == 'wp'){
                          
                                  let exist = message.indexOf(palavras[0].toString());
                  
                                  if(exist !== -1){
                                          message = message.replace(palavras[0].toString(), palavras[1].toString())
                                  }
      
                          }else  if(opt == 'html'){
                          
                                  let exist = message.indexOf(palavras[1].toString());
                  
                                  if(exist !== -1){
                                          if(palavras[1].toString() !== ''){
                                              message = message.replace(palavras[1].toString(), palavras[0].toString())
                                          }
                                          
                                  }
      
                          }
                          
                  }
      
      
                resolve(message);
      
              });
            
      }


      /* verificar se está logado */
       /* consulta status da sessão */
    $scope.verifyLogged = async function(){

        return new Promise( async (resolve, reject) => {

                    $http({
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method:'POST',
                        url: $scope.base_url + 'verifyLogged',
                        data:JSON.stringify({})
                    }).then(async function(data){
                                           
                        var logged = data.data.logged;
                        
                        if(logged == true){

                            console.log("\r\n Sistema está logado 👍.")

                        }else{

                            /* se não estiver logado redirecionar para login */
                                /* alert */
                                $ngConfirm({
                                    title: "Confirmar?",
                                    content: "O tempo de login do sistema expirou, vamos redirecionar para realizar login.",
                                    type: "red",
                                    typeAnimated: true,
                                    buttons: {
                                        tryAgain: {
                                            text: "Confirmar",
                                            btnClass: 'btn-green',
                                            action: function(){
                                                
                                                /* redirect login */
                                                $window.location.href = $scope.base_url + '';

                                            }
                                        },
                                        Fechar: {
                                            text: 'Cancelar',
                                            action: function(scope, button){
                                                
                                                 /* redirect login */
                                                 $window.location.href = $scope.base_url + '';

                                            }
                                        }
                                    }
                                });


                        }

                        resolve(logged);            
                                    
                    });

        });

}


    $scope.verifyLogged();
    $scope.get_sessions();
    $scope.get_contatos();
    $scope.getStatusAutoresp();
    $scope.verifyService();
    $scope.initSocketIoAll();
    $scope.loadSound(); /* registrar sons de notificaçao */

 
}]);