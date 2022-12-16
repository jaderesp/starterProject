
jms_app.controller('Editor_controller',
  ['$scope', '$window', '$http', '$timeout', '$location', '$ngConfirm', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'EditorFac', 'itemsSetup', 'Utils',
    async function ($scope, $window, $http, $timeout, $location, $ngConfirm, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, EditorFac, itemsSetup, Utils) {

      $scope.base_url = $("#baseUrl").val() + "/";
      $scope.api_url = $("#apiUrl").val();

      /* factorys (classes) */
      $scope.Editor = EditorFac;
      console.log(EditorFac);



      /* incializar editor */
      $scope.Editor.setupEditor.start();

      $scope.base_url = $("#baseUrl").val() + "/";
      $scope.api_url = $("#apiUrl").val();


      /* vars tratamento itens editor */
      $scope.globalitemsEditor = [];

      /* op veriricar sesessão foi selecionada para criar a respposta */
      $scope.opSessionEditor = false; /* radios options */
      $scope.sessSelect = null;

      $scope.editorInicializado = false;/* sinalizar se editor foi iniciado e carregado todos os itens, (não executar ações nos eventos ao iniciar o editor) */


      /* socketEv events */
      //var socketEv = io($scope.base_url, {transports: ['websocketEv', 'polling', 'flashsocketEv'], autoConnect: true});
      var socketEv = io($scope.base_url);
      //var socketEv = await $scope.Editor.initSocket();



      $scope.editorResponsive = async () => {

        let margens = 10;
        let width = document.getElementById("menu_autor").offsetWidth - margens;


        $('#drawflow').css("top", '0px');
        $('#drawflow').css("margin-left", margens + 'px');
        $('#drawflow').css("width", (width) + 'px');
        $('#drawflow').css("height", '1800px');
        $('#drawflow').css("overflow", 'hidden'); /* fixar limite borda do editor */

        /* hidden footer */
        $('.footer').hide();

        /* overflow: hidden; */
        /* finalizar loading */
        $("#menu_autor").loading('stop');
      }

      await $scope.editorResponsive();


      /* =================== layouts ============ */

      /* formatar responsividade do editor */
      $(window).resize(async function () {

        await $scope.editorResponsive();

      });



      /* ===================== itens dentro do editor=========== */


      $scope.addControls = async (type, action) => {

        /* 
            pamaetros da função:
  
                type: tipo de itens: button, mensagem, msg + media ...
                typeBd: intent ou response (bando de dados)
  
        */

        /* verificar se o select das sessões foi selecionado */
        if (!$scope.sessSelect) {

          $scope.messageBox('Atenção!', 'Selecione a sessão pertencente a este bot.', 'OK', 'orange');
          return;

        }


        /* add no banco dados  e retornar dados do item inserido */
        let params = {};

        let result = await $scope.setupItem(type, action);

        console.log("\r\n Resultado do cadastro do item solicitado no banco de dados: ", result);

        if (result) {

          let id_item = result.id_abresp;
          /* formatar layout com dados do banco (id) e inserir item no editor  */
          $scope.Editor.addItemEditor(type, id_item);
        }

        /* recolher modal de controles do bot */
        $('#controles_modal').modal('hide');

      }


      /* cadastrar no banco de dados */
      /* setupIntent ou response */
      $scope.setupItem = async function (itemType, action, pars) {

        /* 
          parametros:
             itemType (nome do item a ser criado ex.:  
                        -mensagem, 
                        -msg_media, 
                        -buttons, 
                        -buttons_list, 
                        -file, 
                        -atendente
                      )


              action (add, remove, edit, get)

        */

        return new Promise(async (resolve, reject) => {

          let retorno = false;

          let params;
          let type;


          /* verificar se o select das sessões foi selecionado */
          if (!$scope.sessSelect) {

            $scope.messageBox('Atenção!', 'Selecione a sessão pertencente a este bot.', 'OK', 'orange');
            return;

          }

          if (!itemType && action == 'add') {

            console.log("\r\n informe o nome do item a ser criado.")
            resolve(false);
            return;

          }

          /* formatar parametros conforme item */
          if (pars) {

            params = pars;

          } else if (action == 'add') {
            /* criar novo item vazio */
            params = {
              'id_ticket': 001, /* ainda á programar... */
              'id_sess': $scope.sessSelect.id_sess,
              'type': itemType,  /* verificar depois... (se tipo de mensagem buttons ou msg ou midia, ou se tipo de respostas (intent, ou response)) */
              'json_data': '[]' /* inserir dados aqui, ao realizar o relacionamento entre itens (node) */
            };

          }


          if (!params) {

            console.log("\r\n nenhum parâmetro informado para executar a requisição.")
            resolve(false);
            return;

          }

          retorno = await postIn(params, action);

          console.log("\r\n Retorno da requisição http (post): ", retorno);

          /* */

          resolve(retorno);

        });

      }

      /* retornar todos os itens do editor (bd) */
      $scope.getAllItensDb = async function (sessaoSelect, type) {

        return new Promise(async (resolve, reject) => {

          /* verificar se o select das sessões foi selecionado */
          if (!sessaoSelect) {

            $scope.messageBox('Atenção!', 'Selecione a sessão para pesquisa de bots.', 'OK', 'orange');
            return;

          } else {

            $scope.sessSelect = sessaoSelect;

          }

          let pars = { 'id_sess': $scope.sessSelect.id_sess };

          var items = await postIn(pars, 'get');

          if (items.length > 0) {

            /* limpar o editor */
            EditorFac.editor.clearModuleSelected();

            await $scope.setupDraw(items);
            /*  =============== conexões (RELACIONAL) ============== */
            await $scope.setupConxoes();
            await itemsSetup.setValuesIntoInputs();

            $scope.editorInicializado = true;

          } else {

            /* limpar o editor */
            EditorFac.editor.clearModuleSelected();

          }

          resolve(items);

        });


      }

      /* setup de itens cadastrados no editor */
      /* setup draws */
      $scope.setupDraw = async (result) => {

        return new Promise(async (resolve, reject) => {

          if (result) {


            if (!result) {
              console.log("Nenhum dado de " + type + " encontrados.")
              return;
            }

            console.log("Retorno de pesquisa de draws: ", result);

            $scope.globalitemsEditor = [];

            for (var i = 0; i < result.length; i++) {


              $scope.globalitemsEditor.push(result[i]);/* armazenar varray global, para adicionar controles via id, porteriormente */

              await $scope.Editor.addItemEditor(result[i].type, result[i].id_abresp, '', result[i].posx, result[i].posy);



            }

          }

          resolve(true);

        });


      }

      /* limpar o editor */
      $scope.removeAllItens = function () {


        /* alert */
        $ngConfirm({
          title: 'Atenção!',
          content: 'Deseja Relmente remover todos os itens do editor?',
          type: 'orange',
          typeAnimated: true,
          buttons: {
            tryAgain: {
              text: 'Remover Tudo',
              btnClass: 'btn-green',
              action: function () {

                /* remover todos o node */
                EditorFac.editor.clearModuleSelected();

              }
            },
            Fechar: {
              text: 'Fechar',
              action: function (scope, button) {
                return;
              }
            }
          }
        });



      }

      /* gerar layout de conxões dos itens (dados do BD) */
      /* gerar as conexões entre  */
      $scope.setupConxoes = async function () {

        return new Promise(async (resolve, reject) => {

          let conexoes = [];

          /* pegar todas as conexoes dos itens */
          for (var y = 0; y < $scope.globalitemsEditor.length; y++) {

            let jdata = JSON.parse($scope.globalitemsEditor[y].json_data);
            let conxs = [];

            if (!jdata.relaciona == false) {

              conxs = jdata.relaciona;

            } else {
              continue;
            }

            /* verificar quantidades de conexões por item (json) */
            for (var x = 0; x < conxs.length; x++) {

              if (conxs[x]) {
                conexoes.push(conxs[x]);
              }

            }
            // conexoes.push(conxs);

          }

          for (var i = 0; i < conexoes.length; i++) {
            if (EditorFac.editor) {
              /* conexão relacional entre os dois draws */
              if (conexoes[i].origem && conexoes[i].destino) {

                let output_id = await $scope.filterLayoutId(conexoes[i].origem);
                let input_id = await $scope.filterLayoutId(conexoes[i].destino);

                console.log("Criando conexão:")
                await EditorFac.editor.addConnection(output_id, input_id, "output_1", "input_1");

                /* add input option button, button list, message, file etc... */
                await setItemLayout(conexoes[i].origem, conexoes[i].destino);


              }

            }

          }

          EditorFac.editor.zoom_value = 0.1000000000000001;


          resolve(true);

        });

      }

      /* ================ adicionando itens com id customizado ================ */


      /* ======================== UTILIDADES ======================= */
      $scope.setupConexion = async function (output_id, input_id, vType) {

        /* 
                params: 
                    vType = tipo de verificação:   add (se não existir adicionar), remove (se existir, remover)
        
        */

        return new Promise(async (resolve, reject) => {

          /* verificar se já tem dados relacionais resgatar, alterar e atualizar */
          let itemBD = await $scope.setupItem(null, 'get', { 'id_abresp': output_id });


          /* ==== tratativa dos imputs contidos no itens (output_id) ===== */
          let input = $('#input_btn_' + output_id);
          let title_input = '';

          /* adicionar valor aos inputs referente a conexão de origem */
          if (input.is(':visible') == true) {

            title_input = input.val();

          }

          var json_data = [];

          /* se já existir dados relacionais no item, acrescentar */
          if (itemBD.length > 0) {

            itemBD[0].json_data = JSON.parse(itemBD[0].json_data);

            if (itemBD[0].json_data.length > 0) {

              var exist = false;
              for (var i = 0; i < itemBD[0].json_data.length; i++) {

                if (itemBD[0].json_data[i].origem == output_id && itemBD[0].json_data[i].destino == input_id) {
                  exist = true;

                  /* se existir relacionamento e opção vType for remover, então remover  */
                  if (vType == 'remove') {

                    itemBD[0].json_data.splice(i, 1); /* remover conexão */

                  }

                  break;
                }

              }

              /* se não existir relacionamento identico, e opção vType for nula, então adicionar */
              if (exist == false && !vType) {

                itemBD[0].json_data.push({ 'origem': output_id, 'destino': input_id, 'se_valor': input_id, 'title': title_input });

              }


              json_data = itemBD[0].json_data;

            } else {

              json_data = [{ 'origem': output_id, 'destino': input_id, 'se_valor': input_id, 'title': title_input }];

            }

          } else {

            json_data = [{ 'origem': output_id, 'destino': input_id, 'se_valor': input_id, 'title': title_input }]; /* se a mensagem vier do id_abresp = e o valor for ..., então disparar mensagem de destino */

          }



          resolve(json_data);

        });

      }

      /* filtrar id do item no layout (id layout diferente data.id (banco de dados)) */
      $scope.filterLayoutId = async (dataId) => {

        return new Promise(async (resolve, reject) => {

          var exportdata = EditorFac.editor.export();
          var items = exportdata.drawflow.Home.data;

          var i = 1;

          while (items[i] ? true : false) {

            if (items[i].data.id_abresp == dataId) {
              resolve(items[i].id)
              return;
            }

            i = i + 1;

          }

          resolve(false);
        });

      }



      /* ======================== utilidade =============================== */
      /* set messageBox tipos */
      $scope.messageBox = async function (titulo, msg, btnTitle, cor, redir) {

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
              action: function () {
                if (redir) {
                  $window.location.href = $scope.base_url + redir;
                }
              }
            },
            Fechar: {
              text: 'Fechar',
              action: function (scope, button) {
                if (redir) {
                  $window.location.href = "../../" + redir;
                }
              }
            }
          }
        });


      }




      var selectedIDNode = null;
      /* ============= EVENTOS do drwflow ============= */
      EditorFac.editor.on('nodeSelected', function (id) {


        var exportdata = EditorFac.editor.export();
        var item_ = exportdata.drawflow.Home.data[id];
        var id_abresp = item_.data.id_abresp;

        if (id_abresp) {

          selectedIDNode = null;
          selectedIDNode = id_abresp;
          console.log("Item selecionado ====> " + id);

        }


      })

      EditorFac.editor.on('nodeRemoved', async function (id) {


        if (selectedIDNode) {

          var paramsItem = { 'id_abresp': selectedIDNode };

          let res = await $scope.setupItem(null, 'remove', paramsItem);

          console.log("\r\n O Item foi removido: " + id, res);

        }


      })

      /* ======== EVENTOS ================================== */

      EditorFac.editor.on('nodeMoved', async function (id) {

        var exportdata = EditorFac.editor.export();
        var item_ = exportdata.drawflow.Home.data[id];
        var id_abresp = item_.data.id_abresp;

        if (!item_) {

          console.log("\r\n Não exste itens para verificar dados de posicionamento.")
          return;
        }

        var posx_ = item_.pos_x;
        var posy_ = item_.pos_y;
        var paramsItem = { 'id_abresp': id_abresp, 'posx': posx_, 'posy': posy_ };

        let res = await $scope.setupItem(null, 'update', paramsItem);



        console.log("Movendo o item ====> " + id, res);
      })


      EditorFac.editor.on('addReroute', function (id) {
        console.log("\r\nAdiconando relacionamento de itens " + id);
      })


      /* conexões */
      EditorFac.editor.on('connectionCreated', async function (relacao) {
        console.log('\r\n Conexão criada: ');
        console.log(relacao);

        if (relacao.output_id && $scope.editorInicializado == true) {

          var exportdata = EditorFac.editor.export();
          var item_1 = exportdata.drawflow.Home.data[relacao.input_id]; /* ligando para... */
          var item_2 = exportdata.drawflow.Home.data[relacao.output_id]; /* saindo de ... */
          var input_id = item_1.data.id_abresp; /* id relacional (destino) */
          var output_id = item_2.data.id_abresp; /* id relacional (origem) */

          /* verificar se existe relacionamento igual atual */
          //var json_data = await $scope.setupConexion(output_id, input_id);               
          var json_data = await itemsSetup.getJsonData(output_id, input_id);

          var paramsItem = { 'id_abresp': output_id, 'id_ticket': 001, 'json_data': JSON.stringify(json_data) };

          let res = await $scope.setupItem(null, 'update', paramsItem);

          /* add input option button, button list, message, file etc... */
          setItemLayout(output_id, input_id);

          console.log('\r\n Conexão criada: ' + relacao, res);

        }

      })



      EditorFac.editor.on('connectionRemoved', async function (relacao) {

        if (relacao.output_id) {

          var exportdata = EditorFac.editor.export();
          var item_1 = exportdata.drawflow.Home.data[relacao.input_id]; /* ligando para... */
          var item_2 = exportdata.drawflow.Home.data[relacao.output_id]; /* saindo de ... */
          var input_id = item_1.data.id_abresp; /* id relacional (destino) */
          var output_id = item_2.data.id_abresp; /* id relacional (origem) */

          /* verificar se existe relacionamento igual atual */
          //var json_data = await $scope.setupConexion(output_id, input_id, 'remove');
          var json_data = await itemsSetup.getJsonData(output_id, input_id, 'remove');

          var paramsItem = { 'id_abresp': output_id, 'json_data': JSON.stringify(json_data) };

          let res = await $scope.setupItem(null, 'update', paramsItem);

          /* remove input option button, button list, message, file etc... */
          setItemLayout(output_id, input_id, 'remove');

          console.log('\r\n Conexão removida: ' + relacao, res);

        }

      })
      //await $scope.Editor.initSocket();

      // $scope.Editor.eventoTimer();




      /* ================= SOCKET =================== */

      socketEv.on('connect', function () {

        console.log("\rzn Socket client: ", socketEv);

        socketEv.on("moduloSelect", async function (data) {

          console.log("\r\n Dados da Contagem: ", data)

        });

        socketEv.on('contando', function (teste) {

          console.log('\r\n Evento contando: ', teste);

        })

        socketEv.on("disconnect", () => {

          console.log("Erro, o ssocketEv esta desconectado favor verifique.");

        });

      })



      /* INICIALIZAR FUNÇÕES NECESSÁRIAS */
      /* retornar todos os itens cadastrados */
      await $scope.getAllItensDb();
      //await $scope.setupConxoes();


    }]);