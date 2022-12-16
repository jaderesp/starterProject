jms_app.controller('Usuario_controller', ['$scope','$window','$http','$timeout','$interval','$location', '$ngConfirm','DTOptionsBuilder', 'DTColumnBuilder','DTColumnDefBuilder', async function($scope,$window, $http,$timeout,$interval,$location,$ngConfirm,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){

    $scope.base_url = $("#baseUrl").val() + "/";
    $scope.api_url = $("#apiUrl").val();

    /* forms */
    $scope.frm_user = {}

    /* listas */
    $scope.usuarios_list = [];
    $scope.confSenha = "";
    $scope.opAltSenha = false;

    /* selectcs */
    $scope.typeUser_list = [
        { 'name':'owner', 'cor':'#9b43ff'},
        { 'name': 'admin', 'cor':'#14bc4f'},
        { 'name': 'atendente', 'cor':'#43aaff'}

     ]


    
    /* indices names */
    $scope.indexNames = [];
    /* campos  */
    $scope.fields_table = [];       
    /* sessao datatable */
    $scope.dtInstance = {};
    

     /* --------------------------------------- angulrjs DATATABLES ------------------------------------- */          
            /* formatar datatables */
            $scope.dtOptions = {};
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('initComplete', function()
                {
                    /* executar qualquer ação após o carregamento completo da tabela */
                    $scope.set_tbody();
                })
                .withOption('bLengthChange', true)
                .withOption('responsive', true)
            // .withOption('scrollX', true)
                .withOption('autoWidth', false)
                .withOption("destroy", true)
                .withLanguage({
                    "sEmptyTable": "Nenhum à ser Apresentado",
                    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sInfoThousands": ".",
                    "sLengthMenu": "_MENU_ resultados por página",
                    "sLoadingRecords": "Carregando...",
                    "sProcessing": "Processando...",
                    "sZeroRecords": "Nenhum registro encontrado",
                    "sSearch": "Pesquisa Rápida",
                    "oPaginate": {
                        "sNext": "Próximo",
                        "sPrevious": "Anterior",
                        "sFirst": "Primeiro",
                        "sLast": "Último"
                    },
                    "oAria": {
                        "sSortAscending": ": Ordenar colunas de forma ascendente",
                        "sSortDescending": ": Ordenar colunas de forma descendente"
                    }
                });
                

          

            /* configurar colunas */
            $scope.dtColumnDefs = 
            [        
                DTColumnDefBuilder.newColumnDef(1).withOption('width', '45%'),
                DTColumnDefBuilder.newColumnDef(2).withOption('width', '20%'),
                DTColumnDefBuilder.newColumnDef(3).withOption('width', '12%'),
                DTColumnDefBuilder.newColumnDef(5).withOption('width', '9%'),
                DTColumnDefBuilder.newColumnDef(6).withOption('width', '15%')       

            ];
    

            /* inicializar datatable */
            $scope.destroy = function() 
            {
                $scope.dtInstance.DataTable.ngDestroy();              
            }

            /* inicializar sessao da tabela */
            $scope.dtIntanceInicialize = function (instance) 
            {

                $timeout(function(){
                    $scope.dtIntance = {};
                    $scope.dtIntance = instance;
                },500);
            
            // $scope.dtIntance.reloadData();
            // $scope.dtInstance.DataTable.draw()
            }

            /* exibir linhas da tabela após o carregamento da biblioteca angularjs */
            $scope.set_tbody = function()
            {
                /* função: não permitir a exibição de codigos fontes na tela antes do carregamento da biblioteca do angular
                SOMENTE PARA TABELAS */
                $timeout(function()
                {  
                
                        if(typeof($("#linhas_dados")) !== "undefined")
                        {     
                            $( "#linhas_dados" ).fadeIn("slow", function() 
                            {
                                $('#linhas_dados').removeAttr('style')
                            });

                        
                        }

                    
                },300);

            }
            
            /* FIM --------------------------------------- angulrjs DATATABLES ------------------------------------- */ 



            $scope.get_usuarios = async function(id){

                var opcao = {'id':id};
               
                $http({
                    method:'POST',
                    url: $scope.base_url + "usuario/getAll",
                    data:opcao
                }).then( async function(data){
                        var result;                   
                        result = data.data.dados;
        
                        console.log("lista de Setores: ", result);        
                       
                        $scope.usuarios_list = result;
        
                });
                
        
            }
        
            /* cadastrar Setor */
             /* create and get Intents */
             $scope.setupUsuario = async function(){
        
                return new Promise( async (resolve, reject) => {
        
                    var opcao = {};
        
                    if(!$scope.frm_user.nome){
                        $scope.messageBox('Atenção!','Informe um nome para setor.', 'OK','orange');
                        return;
                    }       
                
                   
                    angular.extend(opcao,$scope.frm_user);
        
                    //$scope.frm_user = {};           
               
                    $http({
                        method:'POST',
                        url: $scope.base_url + "usuario/setupOperador",
                        data:opcao
                    }).then( async function(data){
                        var result;                   
                        result = data.data.retorno;
            
                        console.log("dados do Setor criada: ", result);
        
                        if(result){
        
                            if(result !== false){
        
                                $scope.messageBox('OK','Dados do Setor foram salvos.', 'OK','green');
        
                                $scope.get_usuarios();/* atualizar lista */
        
                            }else{
        
                                $scope.messageBox('Atenção!','Não foi possível realizar o cadastro do Usuario.', 'OK','orange');
        
                            }
        
                        }else{
        
                            $scope.messageBox('Atenção!','Não foi possível realizar o cadastro do usuário.', 'OK','orange');
                            resolve(false);
                            return;
                        }
                       
                       
                        resolve(result);
            
                    },function(error){
        
                        console.log("Ocorreu um erro ao tentar criar a Setor: ", error);
                        resolve({});
        
                    });
        
        
                });
        
        
            }


            /* exibir modal editar contato */
     $scope.setupUsuario_modal = async function(item){
                
        let cont = 0;

            if(!item){

                $scope.frm_user = {};
                $scope.ddd = '';


                /* incializar select setor */
                
                let int_ = $interval(function(){
                    /* prencher select2 array ddd regiao (segmentacao) */
                    $('#default-select-multi2').select2({
                        dropdownAutoWidth: true,
                        width: '100%',
                        data: []
                    });

                    if(cont > 1){
                        $interval.cancel(int_)
                    }
                    cont = cont + 1;
                })
                
            }else{


                /* preencher select setores do usuario do banco dedos */
                let item_ = {};
                angular.extend(item_, item);
                item.setores = [];
                for(var i = 0; i < item_.setores.length; i++){

                    item.setores.push(item_.setores[i].id_setor.toString());

                }

                let int_ = $interval(function(){
                    /* prencher select2 array ddd regiao (segmentacao) */
                    $('#default-select-multi2').select2({
                        dropdownAutoWidth: true,
                        width: '100%',
                        data: item.setores
                    });

                    if(cont > 1){
                        $interval.cancel(int_)
                    }
                    cont = cont + 1;
                })

                
                
                angular.extend($scope.frm_user,item);                        
                //document.querySelector('#cor').jscolor.setPreviewElementBg(item.cor);

            }


            $("#setupUsuario_modal").modal('show');

    }

    $scope.confirmSenha = async () => {

        if($scope.confSenha){

            if($scope.frm_user.senha !== $scope.confSenha){

                $scope.messageBox('Atenção!','Senhas não conferem, favor digite a confirmação de senha.', 'OK','red');
                $scope.confSenha = '';

            }

        }

    }

    $scope.validCpfCnpj =  async function(){

        var opcao = {};
        var number = $('#cpf').val();
        
        angular.extend(opcao,{'cpf':number});
       
        $http({
            method:'POST',
            url: $scope.base_url + "validate/cpfCnpj",
            data:opcao
        }).then( async function(data){
                var result;                   
                result = data.data.dados;

               if(result == false){

                    $scope.messageBox('Atenção!','Desculpe, mas este cpf não é válido, verifique por favor.', 'OK','red');
                    
                    $scope.frm_user.cpf = "";

               }

          

        });
        

    }


    /* verificar por email se a credencial do cliente já existe */
    $scope.verify_credenciais =  async function(){

        var opcao = {};

        angular.extend(opcao,{'email':$scope.frm_user.email});
        
        $http({
            method:'POST',
            url: $scope.base_url + "registro/verify",
            data:opcao
        }).then( async function(data){
                var result;                   
                result = data.data.dados;

                if(result == true){

                $scope.messageBox('Atenção!','Este emails já possui registro no sistema.', 'OK','red');
                
                $scope.frm_user.email = "";


                }

            

        });
        

    }

      
    
     /* ======================== utilidade =============================== */
  /* set messageBox tipos */
  $scope.messageBox = async function(titulo, msg, btnTitle, cor, redir){

    /* params: redir --> redirecionar para url informada */
    /* cores: 'purple','red','blue','dark','orange' */

    /* alert */
        $ngConfirm({
                title: titulo,
                content: msg,
                type: cor,
                typeAnimated: true,
                buttons: {
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
                }
            });


    }

          /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  EXCLUSÃO COM CONFIRMAÇÃO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
   /* remover */
   $scope.confirma_exclusao_registro = function(item){

        /* alert */
    $ngConfirm({
        title: "Confirmar?",
        content: "Deseja realmente excluir a setor  " + item.nome + " e todos os registros relacionados?",
        type: "red",
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: "Confirmar",
                btnClass: 'btn-green',
                action: function(){
                    $scope.removeRegs(item.id_etiq);
                }
            },
            Fechar: {
                text: 'Cancelar',
                action: function(scope, button){
                    
                }
            }
        }
    });

    }

    /* remover plano existente */
    $scope.removeRegs = function(id_etiq)  
    {
        var opcao={};
    // angular.extend(opcao,{'opcao':'remover'});
        angular.extend(opcao,{'id_etiq':id_etiq});

                                
        $http({
                method:'POST',
                url: $scope.base_url + "usuario/remove",
                data:opcao
            }).then(function(data){
                var result;                   
                retorno = data.data.dados;
                
                
                if(retorno == false || retorno == undefined || retorno == ""){
                    $scope.messageBox('Atenção!','ocorreu um problema ao realizar a operação.', 'OK','red');
                }else{
                    $scope.messageBox('Sucesso!','O registro foi removido com sucesso.', 'OK','blue');
                   
                }

                 /* atualizar lista de cadastros */
                 $scope.get_usuarios();

                
                                                    
            });

    }


    $scope.get_usuarios();




}]);