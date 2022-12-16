jms_app.controller('Usuario_controller', ['$scope','$window','$http','$timeout','$location', '$ngConfirm','DTOptionsBuilder', 'DTColumnBuilder','DTColumnDefBuilder', function($scope,$window, $http,$timeout,$location,$ngConfirm,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){

    $scope.base_url = $("#base_url").val() + "/";

    /* object modal */
    $scope.frm_modal = {};

    /* vars */
    $scope.frm_usuario = {};
    $scope.usuario_list = [];

    /* carregar tipos de usuário */
    $scope.tipo_usuario_list = [];

    /* consulta paciente do familiar */
    $scope.paciente_profiss = [];
    /* lista de pacientes designados para profissional */
    $scope.list_designados = [];
    /* profissional selecionado para configurar */
    $scope.usuario_selecionado = {};

    /* campos paciente */
    $scope.fields_usr = {};
    /* campos extras para adicionar o formulario */
    $scope.fields_extras = {};
    
       
    /* instancia datatable */
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

    /* inicializar instancia da tabela */
    $scope.dtIntanceInicialize = function (instance) 
    {
        $scope.dtIntance = {};
        $scope.dtIntance = instance;
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



        /* retornar pacientes cadastrados */
        
        $scope.get_usuarios = function(id_usr){

            var opcao = {};
            angular.extend(opcao,{'opcao':'get'});
            if(id_usr){

                angular.extend(opcao,{'id_usr':id_usr});
            }
         

            $http({
                method:'POST',
                url: $scope.base_url + "public/Sistema/Usuario_controller/get",
                data:opcao
            }).then(function(data){
                var result;                   
                result = data.data.retorno;


                $scope.usuario_list = [];
                $scope.usuario_list = result.usuario;
              
                             
            });
            

        }
        

        /* carregar tipos de usuários para campo de cadastro */
        $scope.get_tipos_usr = function(){

            var opcao = {};
            angular.extend(opcao,{'opcao':'get'});
          

            $http({
                method:'POST',
                url: $scope.base_url + "public/Sistema/Usuario_controller/get_tipo_usr_json",
                data:opcao
            }).then(function(data){
                var result;                   
                result = data.data.retorno;


                $scope.tipo_usuario_list = [];
                $scope.tipo_usuario_list = result;
              
                             
            });
            

        }

       


        /* add */
        $scope.add_user = function(){

            /* verificar campos preenchidas */
            var confSenha = $('#conf_senha').val();
            /* verificar confirmação de senha */
            if(confSenha !== $scope.fields_extras.conf_senha){

                $scope.messageBox('Atenção','As senhas digitadas não coencidem, verifique por favor!', 'OK','orange');
                return;                
            }

            /* incrementar objeto de paciente aos dados de formulario submetido */
           // angular.extend($scope.frm_usuario,{'paciente':$scope.paciente_profiss});

            $http({
                method:'POST',
                url: $scope.base_url + "public/Sistema/Usuario_controller/setup",
                data:$scope.frm_usuario
            }).then(function(data){
                var result;                   
                result = data.data.retorno;               

                $scope.get_retorno_usr(result,"add");

                             
            });

        }

        /* pacientes para relacionar ao usuario */
        
        $scope.get_pacientes_profiss = function(cpf){

            var opcao = {};
            angular.extend(opcao,{'opcao':'cpf_pc','valor':this.consultar});
         

            $http({
                method:'POST',
                url: $scope.base_url + "public/Sistema/Paciente_controller/get_filter_paciente",
                data:opcao
            }).then(function(data){
                var result;                   
                result = data.data.retorno;

                var arr = [];
                angular.forEach(result, function(value, key){
                    arr.push(value);
                });

                /* contar indice do object paciente_fam */
                var indice = 0;
                angular.forEach($scope.paciente_profiss, function(value, key){
                    indice = indice +1;
                });
               
                $scope.paciente_profiss[indice] = arr[0];
                             
            });
            

        } 

        /* designar paciente para o profissional selecionado */
        $scope.designar_setup = function(item,op){

            var opcao = {};
            var id_usr = $scope.usuario_selecionado.id_usr;
            var item = this.pac;
            /* enviar parametro opção: remover ou desiganar (add) */
            angular.extend(opcao,{'opcao':op,'id_pc':this.pac.id_pc, 'id_usr':id_usr});

            $http({
                method:'POST',
                url: $scope.base_url + "public/Sistema/Usuario_controller/designar_setup",
                data:opcao
            }).then(function(data){
                var result;                   
                result = data.data.retorno;              

                if(result == true){

                  
                   
                }else if(result = 'exist'){

                    $scope.messageBox('Atenção!','Paciente já faz parte da lista do profissional ' + $scope.usuario_selecionado.nome_usr + '.' , 'OK','orange');
                    
                }

                /* limpar lista de usuario pesquisados */
                $scope.paciente_profiss = [];

                 /* atualizar lista de designados do profissional */
                 $scope.get_designados($scope.usuario_selecionado);


                             
            });
            

        }


        /* retornar pacientes designados do profissional */
        $scope.get_designados = function(item){

            var opcao = {};
            /* enviar parametro opção: remover ou desiganar (add) */
            angular.extend(opcao,{'id_usr':item.id_usr});

            /* guardar usuario selecionado */
            $scope.usuario_selecionado = {};
            $scope.usuario_selecionado = item;

            /* limpar lista de usuario pesquisados */
            $scope.paciente_profiss = [];


            $http({
                method:'POST',
                url: $scope.base_url + "public/Sistema/Usuario_controller/get_pacientes_designados",
                data:opcao
            }).then(function(data){
                var result;                   
                result = data.data.retorno;               

                $scope.list_designados = [];
                $scope.list_designados = result;
                             
            });

        }



        /* ======================== utils ================================== */

            /* funcao criar formulario */
            $scope.setup_operacao_crud = function(type, item){ /* add ou update */

                    var frm_dados = {}           
                    angular.extend(frm_dados,item);

                    var formulario;
                    $scope.frm_modal = {};
                    var titulo_form = 'usuario_formulario';

                    formulario = {
                        "id":titulo_form,
                        "titulo":"Configuração de Acesso",
                        "descricao":"Configurar acesso."
                    }

                    if(item.id_usr !== undefined){
                       formulario.descricao = "Configurar acesso para <div class='label label-table label-success'>" + item.usuario_usr + ".</div>";
                    }
                    
                    
                    
                    /* gerar inputs automaticamente conforme objeto enviado como parametro */
                    var arr = [];
                    var inputs = [];

                    /* size: tamanho é calculado por classe bootstrap de cols ex.: col-md-5 */
                    /* 
                        titulo --> titulo da label do input
                        tipo --> type do input
                        size --> tamanho da div do form usanto classes bootstrap ex.: col-md-4 etc...
                        mascara --> formatação do valor dentro do input ex.: cpf, date, moeda etc...

                    */


                    /* adicionar aqui as opções vindas do bd para o SELECT */
                    var op_tipos_usuario = [];
                    angular.forEach($scope.tipo_usuario_list, function(value, key){

                        op_tipos_usuario.push({'titulo':value.titulo_tpu, 'valor':value.id_tpu});

                    });

                    /* obedecer sequencia das colunas da tabela do banco de dados */
                    var labels = [
                        /* input hiddens */
                        {'titulo':'','tipo':'hidden','campo_extra':false,'size':'0','mascara':'','obrigar':false,'inativo':false,'opcoes':[]},
                        
                        /* selecionar tipo de usuario */                       
                        {'titulo':'Tipo de Usuário','tipo':'select_data','campo_extra':false,'size':'4','mascara':'','obrigar':true,'inativo':false,
                        'opcoes':op_tipos_usuario},

                        {'titulo':'Nome','tipo':'text','campo_extra':false,'size':'7','mascara':'','obrigar':true,'inativo':false,'opcoes':[]},
                        {'titulo':'Usuário','tipo':'text','campo_extra':false,'size':'4','mascara':'','obrigar':true,'inativo':false,'opcoes':[]},
                        {'titulo':'Senha','tipo':'password','campo_extra':false,'size':'4','mascara':'','obrigar':true,'inativo':false,'opcoes':[]},
                        {'titulo':'Confirmar Senha','tipo':'password','campo_extra':true,'size':'4','mascara':'','obrigar':true,'inativo':false,'opcoes':[]},
                        {'titulo':'Email','tipo':'email','campo_extra':false,'size':'4','mascara':'','obrigar':true,'inativo':false,'opcoes':[]}



                     /*   {'titulo':'Prontuário','tipo':'radio','size':'3','mascara':'','obrigar':false,'inativo':false,
                        'opcoes':[
                            {'titulo':'Editar', 'valor':'EV'},
                            {'titulo':'Visualizar', 'valor':'V'},
                            {'titulo':'Restringir', 'valor':'R'}
                        ]}, */
                        
                   
                            
                    ]

                    /* configurar campos extras */
                    $scope.fields_extras = {};
                    $scope.fields_extras = 
                        {'conf_senha':{}
                    };
                    

                    var y = 0;
                    angular.forEach(labels, function(value, key){

                    
                        if(labels[y] !== undefined && value.tipo !== 'title' && value.campo_extra == false){ /* titulo não é input de dados */
                            inputs.push({
                                'label':value.titulo,
                                'type':value.tipo,
                                'mask':value.mascara,
                                'ngModel': $scope.fields_usr[y],
                                'name': $scope.fields_usr[y],
                                'id': $scope.fields_usr[y],
                                'col': 'col-md-' + value.size,
                                'options':value.opcoes,  /* se for input de multipla escolha */
                                'enabled':value.inativo,
                                'required':value.obrigar,
                                'lembrete':value.lembrete,
                                'campo_extra':value.campo_extra
                            });

                            y = y + 1;                    
                        }

                       

                        if(value.campo_extra == true){ /* titulo não é input de dados */
                            if(value.tipo == 'password'){
                                inputs.push({
                                    'label':value.titulo,
                                    'type':value.tipo,
                                    'mask':value.mascara,
                                    'name': 'conf_senha',
                                    'id': 'conf_senha',
                                    'col': 'col-md-' + value.size,
                                    'options':value.opcoes,  /* se for input de multipla escolha */
                                    'enabled':value.inativo,
                                    'required':value.obrigar,
                                    'lembrete':value.lembrete
                                });
                            }

                             /* se for titulo  */
                            if(value.tipo === 'title'){

                                inputs.push({
                                    'label':value.titulo,
                                    'type':value.tipo,
                                    'col': 'col-md-' + value.size
                                });
                                
                            }
                           
                  
                        }

                      
                        
                    });

                    formulario.inputs = inputs;

                

                    angular.extend($scope.frm_modal,formulario);

                
                    /* aplicar mascaras - OBS.: precisa do jquery.mask.js $('.date').mask('00/00/0000'); */
                    $timeout(function(){

                        angular.forEach(inputs, function(value, key){
                        

                            /* aplicar mascara conforme necessidade */
                            switch(value.mask) {
                                case 'id_paciente':
                                /* carregar o id do paciente selecionado */
                                    $scope.frm_usuario[value.ngModel] = $('#id_paciente').val();
                                    break;
                                case 'cpf':
                                    /* apontar para o id do input a ser configurado */
                                    $('#' + value.id).mask('000.000.000-00', {reverse: true}); /* reverse para remover a formatação ao submeter os valores */
                                    break;
                                case 'cnpj':
                                    /* apontar para o id do input a ser configurado */
                                    $('#' + value.id).mask('00.000.000/0000-00', {reverse: true});
                                    break;
                                case 'currency':
                                    /* apontar para o id do input a ser configurado */
                                    $('#' + value.id).mask('000.000.000.000.000,00', {reverse: true}); 
                                    break;
                                case 'date':
                                    $('#' + value.id).mask('00/00/0000');
                                    break;
                                case 'date_value':
                                    $('#' + value.id).mask('00/00/0000');
                                    $scope.frm_usuario[value.ngModel] = $scope.data_hoje;
                                    break;
                                case 'date_dia_semana':
                                    $scope.frm_usuario[value.ngModel] = $scope.dia_semana;
                                    break;
                                case 'datetime':
                                    $('#' + value.id).mask('00/00/0000 00:00:00');
                                    break;
                                case 'hora':
                                    $('#' + value.id).mask('00:00');
                                    break;
                                case 'fone_fixo':
                                    $('#' + value.id).mask('(00) 0000-0000');
                                    break;
                                case 'fone_cel':
                                    $('#' + value.id).mask('(00) 0 0000-0000');
                                    break;
                                case 'numero':
                                    $('#' + value.id).mask('00');
                                    break;
                                case 'decimal':
                                    $('#' + value.id).mask('00.00');
                                    break;
                                default:
                                // code block
                            } 

                        });

                        /* exibir formulario */
                        $('#'+titulo_form).modal('show');


                        /* UPDATE: adicionar o item selecionado ao object model do formulario */
                        if(frm_dados.id_usr !== undefined && frm_dados.id_usr !== ''){
                            
                            $scope.frm_usuario = frm_dados;

                        }else{

                            $scope.frm_usuario = {};

                        }
                        


                    },500);
                    

                }



            /* campos da tabela */
            $scope.get_fields = function(){

                var opcao = {'table':'usuario','key':'id_usr'};
                $http({
                    method:'POST',
                    url: $scope.base_url + "public/Sistema/Comum_controller/get_field_table",
                    data:opcao
                }).then(function(data){
                    var result; 
                    
                    $scope.fields_usr = {};
                    $scope.fields_usr = data.data;

                    $timeout(function(){
                        $scope.setup_operacao_crud();
                    },500);
                    
                })

            } 

          
            
            /* data atual */
            $scope.dataHoje = function (tipo){

                var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
                var data = new Date();
                var dia = data.getDate();
                var mes = data.getMonth() + 1;

                if (mes < 10) {
                mes = "0" + mes;
            }
            var ano = data.getFullYear();
            var horas = new Date().getHours();
            if (horas < 10) {
                horas = "0" + horas;
            }
            var minutos = new Date().getMinutes();
            if (minutos < 10) {
                minutos = "0" + minutos;
            }

            if(tipo == 'dia_semana'){

                    $scope.dia_semana = semana[data.getDay()];

            }else  if(tipo == 'date'){

                    $scope.data_hoje = dia+"/"+mes+"/"+ano;

            }else  if(tipo == 'date_time'){

                    $scope.data_hoje = dia+"/"+mes+"/"+ano+" - "+horas + "h" + minutos;

            }
            
        }


        /* set messageBox tipos */
        $scope.messageBox = function(titulo, msg, btnTitle, cor, redir){

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

      /* ações de login */
      $scope.get_retorno_usr = function(retorno, tipo){
       
        if(tipo == "add"){

            switch (retorno){
                case true:                    
                    $scope.messageBox('OK','Registro foi efetuado com sucesso!', 'OK','green');
                    break;              
                case false:
                    $scope.messageBox('OoOops','Ocorreu um erro, por favor verifique e tente novamente!', 'OK','orange');
                    break;
                case 'exist':
                    $scope.messageBox('OoOops','Este paciente já possui registro no sistema!', 'OK','red');
                    break;              

            }

            /* atualizar lista de dados */
            $scope.get_usuarios();            

        }
    }


    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  EXCLUSÃO COM CONFIRMAÇÃO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
   /* remover */
   $scope.confirma_exclusao_usr = function(id_usr){

    /* alert */
   $ngConfirm({
       title: "Confirmar?",
       content: "Deseja realmente excluir este registro e todas suas dependências?",
       type: "red",
       typeAnimated: true,
       buttons: {
           tryAgain: {
               text: "Confirmar",
               btnClass: 'btn-green',
               action: function(){
                   $scope.remove_usr(id_usr);
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
$scope.remove_usr = function(id)  
{
    var opcao={};
    angular.extend(opcao,{'opcao':'remover'});
    angular.extend(opcao,{'id_usr':id});

                            
    $http({
            method:'POST',
            url: $scope.base_url + "public/Sistema/Usuario_controller/remove",
            data:opcao
        }).then(function(data){
            var result;                   
            retorno = data.data.retorno;
            
            
            if(retorno == false || retorno == undefined || retorno == ""){
                $scope.messageBox('Atenção!','ocorreu um problema ao realizar a operação.', 'OK','red');
            }else{
                $scope.messageBox('Sucesso!','O registro foi removido com sucesso.', 'OK','blue');
                $scope.get_usuarios();/* atualizar lista */ 
            }

            
                                                
        });

}



    /* carregar tipos de usuário */
    $scope.get_tipos_usr();
    /* carregar os campos para os inputs */
    $scope.get_fields();

}]);