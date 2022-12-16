jms_app.controller('Menu_controller', ['$scope','$http', function($scope, $http) {
    
    $scope.base_url = $("#base_url").val();

    $scope.flag_acesso = false;
    $scope.nivel_acesso = "";
    $scope.menu_arr = {};

    $scope.menu_automatico={};

    
    $scope.menu_arr = {
        'painel':[{
                'titulo':'Painel',
                'link':$scope.base_url + 'public/dashboard',
                'extender':true
            }],
        'informacoes':[{                
                'titulo':'Informações',
                'link': $scope.base_url + 'public/informacoes',
                'extender':true
            }],

        'criar_teste':[{
                'titulo':'Criar Teste',
                'link':'javascript:void();',
                'extender':true
            },
            {
                'titulo':'Customizado',
                'link':$scope.base_url + 'public/criar_teste',
                
            }],
        'sub_revendas':[{
                'titulo':'Sub-Revendas',
                'link':'#',
                'extender':true
            },{
                'titulo':'Gerir Revendas',
                'link': $scope.base_url + 'public/revenda'
            },{
                'titulo':'Criar Revenda',
                'link': $scope.base_url + 'public/revenda/cadastrar'
            },{
                'titulo':'Grupos Revenda',
                'link': $scope.base_url + 'public/revenda/grupo'
            }],
        'usuarios':[{
            'titulo':'Usuários',
            'link':'javascript:void();',
            'extender':true
             },
            {
                'titulo':'Usuários Online',
                'link':$scope.base_url + 'public/clientes/online'
            },{
                'titulo':'Gerir Usuários',
                'link':$scope.base_url + 'public/clientes'
            },{
                'titulo':'Criar Usuário',
                'link':$scope.base_url + 'public/clientes/add'
            }],
        'encurtador':[{
                'titulo':'Encurtador',
                'link': $scope.base_url + 'public/encurtador',
                'extender':true
            }],
        'ferramentas':[{
                'titulo':'Ferramentas',
                'link': $scope.base_url + 'public/ferramentas',
                'extender':true
            }],
        'conteudonovo':[{
                'titulo':'Conteúdo Novo',
                'link':'javascript:void();',
                'extender':true
                 },
                {
                    'titulo':'Novos Canais',
                    'link':$scope.base_url + 'public/conteudo_novo/canais'
                },
                {
                    'titulo':'Novos Filmes',
                    'link':$scope.base_url + 'public/conteudo_novo/filmes'
                },
                {
                    'titulo':'Novas Séries',
                    'link':$scope.base_url + 'public/conteudo_novo/series'
                }],
         'ticketsuporte':[{
                'titulo':'Ticket Suporte',
                'link':'javascript:void();',
                'extender':true
                 },
                {
                    'titulo':'Criar Ticket',
                    'link':$scope.base_url + 'public/tickets/add'
                },
                {
                    'titulo':'Gerenciar Tickets',
                    'link':$scope.base_url + 'public/tickets'
                }],
        'perfil':[{
                    'titulo':'Perfil',
                    'link':'javascript:void();',
                    'extender':true
                },{
                    'titulo':'Acessar',
                    'link':$scope.base_url + 'public/perfil'
                },
                {
                    'titulo':'Meu Plano',
                    'link':$scope.base_url + 'public/plano_revenda'
                }],
        'financeiro':[{
                    'titulo':'Financeiro',
                    'link':'javascript:void();',
                    'extender':true
                    },{
                        'titulo':'Contas à Receber',
                        'link':$scope.base_url + 'public/faturamento'
                    },
                    {
                        'titulo':'Contas à Pagar',
                        'link':$scope.base_url + 'public/faturas'
                    }
                ],
        'desconectar':[{
                    'titulo':'Desconectar',
                    'link': $scope.base_url + 'public/logoff',
                    'extender':true
                }]

        
    };

    /* gerar item de menu automaticamente (gerar teste automaticos) */
    $scope.get_menu_testes = function(){

        $http({
            method:'POST',
            url: $scope.base_url + "sys/api_local/sistema.php",
            data:{'opcao':'menu_criar_testes'}
        }).then(function(data){

            $scope.menu_automatico={};
            $scope.menu_automatico = data.data.retorno; 

        });

    }

    /* pegar tipo de usuário logado */
      /* funcao exibir dados */
      $scope.get_auth = function()  
      {
                 
            $http({
                    method:'POST',
                    url: $scope.base_url + "sys/api_local/user.php",
                    data:{'opcao':'auth'}
                }).then(function(data){

                    $scope.flag_acesso = data.data.retorno;                   

                });

       }

        /* nivel de acesso exato do usuario: admin, master, ultra ou reseller */
      $scope.get_nivel = function()  
      {
                 
            $http({
                    method:'POST',
                    url: $scope.base_url + "sys/api_local/user.php",
                    data:{'opcao':'nivel'}
                }).then(function(data){

                    var retorno = data.data.retorno;
                    $scope.nivel_acesso = retorno;
                   
                });

       } 


       /* executar na inicializaçao */
       $scope.get_auth();

       /* criar items de menu automatico */
       $scope.get_menu_testes();

       /* retornar nivel de acesso do usurio */
       $scope.get_nivel();


}]);