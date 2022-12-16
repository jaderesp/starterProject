jms_app.controller('Recovery_controller', ['$scope','$window','$http','$timeout','$location', '$ngConfirm', function($scope,$window, $http,$timeout,$location, $ngConfirm){

    $scope.base_url = $("#base_url").val() + '/';

    $scope.form_rec = {};


    /* atualizar a senha */
    $scope.setup_recovery = function(type,form)  
       {
           

            /* verificar dados  */          
            if($scope.form_rec.senha !== $scope.form_rec.senhaConfirm){

                $scope.messageBox('OoOops','As senhas digitadas não conferem, por favor verifique e tente novamente!', 'OK','orange');
                return;
            }

           var url_ = ""; /* url para redirecionar devolta ao login conforme tipo de usuario */
            if(type == 'cliente'){

                url_ = "public/Cliente";

            }else if(type == 'usuario'){

                url_ = "public/Admin";

            }

             $http({
                     method:'POST',
                     url: $scope.base_url + 'public/Sistema/Acesso_controller/updateCredencPass',
                     data:{'type':type,'id':form.id,'email':form.email,'senha':$scope.form_rec.senha}
                 }).then(function(data){
                     var result;                   
                     result = data.data;

                     /* pegar nome do usuário */
                     var usuario = $("#usuario").val();

                     if(result.retorno == true){

                        $scope.get_retorno_recov(result.retorno,result.retorno,"","Muito bem, " + usuario,url_);

                     }else{

                        $scope.get_retorno_recov(result.retorno,result.retorno,"");

                     }
  
                     
                                                         
                 });
  
        }


        /* retorno */
        $scope.get_retorno_recov = function(retorno,data, tipo,texto, dir){
       
    
                switch (retorno){
                    case true:                    
                        $scope.messageBox(texto,'estamos redirecionando você para login do painel. <p id="contagem"></p>', null,'blue',dir,'');
                        break;              
                    case false:
                        $scope.messageBox('ERRO!','<b>Seu login/senha estão incorretos <br> Revise e tente novamente!</b>', 'OK','red',null,'fa fa-error');
                        break;
                    case 4:
                        $scope.messageBox('OoOops','Usuário bloqueado, contacte seu revendedor.', 'OK','red');
                        break;
                    case 5:
                        $scope.messageBox('OoOops','Você não tem permissão para acessar o painel office!', 'OK','orange');
                        break;
                    case 6:
                        $scope.messageBox('👨🏼‍✈️Acesso Negado','Você não possui a quantidade mínima de '+ data.qtde_min_cred +' créditos para acessar o painel!', 'Entendido','red');
                        break;
    
                }
    
           
        }



           /* set messageBox tipos */
           $scope.messageBox = function(titulo, msg, btnTitle, cor, redir,icone){

            /* params: redir --> redirecionar para url informada */
            /* cores: 'purple','red','blue','dark','orange' */
            var options = {
                title: titulo,                
                icon: icone,
                theme: 'supervan',
                content: msg,
                type: cor,
                typeAnimated: true,                
                onOpen: function (scope) {
                   
                    /* verificar se contador existe */
                    if (document.getElementsByClassName('ng-confirm-content') && redir){
                        
                        var contador = 3;
                       var intv = setInterval(function(){
                            $('.ng-confirm-content').html('Nosso sistema já está decolando. <li class="fa fa-space-shuttle"></li> \n ' + contador + '...');                            
                            //alert('abriu' + contador);
                            if(contador == 1){
                                
                                if(redir){
                                    $window.location.href =  $scope.base_url + redir;
                                }

                                clearInterval(intv);
                                /* clicar no botão ok */
                                
                            }
                            contador--;

                        },1000)

                    }
                }
            };
         
            if(btnTitle){

                angular.extend(options,{buttons: {
                    tryAgain: {
                        text: btnTitle,
                        btnClass: 'btn-green',
                        action: function(){
                            if(redir){
                                $window.location.href =  $scope.base_url + redir;
                            }
                        }
                    },
                    Fechar: {
                        text: 'Fechar',
                        action: function(scope, button){
                            if(redir){
                                $window.location.href = "../../" + redir;
                            }
                        }
                    }
                }})

            }
            /* alert */
            $ngConfirm(options);

           
    
    
        }


}]);