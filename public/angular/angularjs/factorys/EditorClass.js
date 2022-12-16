
class Editor {

  editor;

  constructor() {
    this.container = document.getElementById("drawflow");
    this.editor = null;

    this.eventos = [];

    this.base_url = $("#baseUrl").val() + "/";
    this.api_url = $("#apiUrl").val();
    this.initSocket();


  }

  get setupEditor() {

    /* cadastrar (registrar) eventos */
    //this.event.addEventListener("contanto", value => (n = value));

    return this.initialize();

  }


  instanceEditor() {

    return this.editor;

  }


  initialize() {

    /* variáveis */
    /* drowflow this.editor */

    let conexoes = [];

    this.editor = null;
    this.editor = new Drawflow(this.container);

    this.editor.reroute = true;
    this.editor.reroute_fix_curvature = true;


    this.editor.position = function (e) {

      if (e.type === "touchmove") {
        var e_pos_x = e.touches[0].clientX;
        var e_pos_y = e.touches[0].clientY;
      } else {
        var e_pos_x = e.clientX;
        var e_pos_y = e.clientY;
      }


      if (this.connection) {
        this.updateConnection(e_pos_x, e_pos_y);
      }
      if (this.editor_selected) {

        x = this.canvas_x + (-(this.pos_x - e_pos_x))
        y = this.canvas_y + (-(this.pos_y - e_pos_y))
        /* x = 0;
         y = 0; */
        this.dispatch('translate', { x: x, y: y });
        this.precanvas.style.transform = "translate(" + x + "px, " + y + "px) scale(" + this.zoom + ")";
      }
      if (this.drag) {

        var x = (this.pos_x - e_pos_x) * this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom);
        var y = (this.pos_y - e_pos_y) * this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom);
        this.pos_x = e_pos_x;
        this.pos_y = e_pos_y;

        this.ele_selected.style.top = (this.ele_selected.offsetTop - y) + "px";
        this.ele_selected.style.left = (this.ele_selected.offsetLeft - x) + "px";

        this.drawflow.drawflow[this.module].data[this.ele_selected.id.slice(5)].pos_x = (this.ele_selected.offsetLeft - x);
        this.drawflow.drawflow[this.module].data[this.ele_selected.id.slice(5)].pos_y = (this.ele_selected.offsetTop - y);

        this.updateConnectionNodes(this.ele_selected.id)

      }

      if (this.drag_point) {

        var x = (this.pos_x - e_pos_x) * this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom);
        var y = (this.pos_y - e_pos_y) * this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom);
        this.pos_x = e_pos_x;
        this.pos_y = e_pos_y;

        var pos_x = this.pos_x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) - (this.precanvas.getBoundingClientRect().x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)));
        var pos_y = this.pos_y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) - (this.precanvas.getBoundingClientRect().y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)));

        this.ele_selected.setAttributeNS(null, 'cx', pos_x);
        this.ele_selected.setAttributeNS(null, 'cy', pos_y);

        const nodeUpdate = this.ele_selected.parentElement.classList[2].slice(9);
        const nodeUpdateIn = this.ele_selected.parentElement.classList[1].slice(13);
        const output_class = this.ele_selected.parentElement.classList[3];
        const input_class = this.ele_selected.parentElement.classList[4];

        let numberPointPosition = Array.from(this.ele_selected.parentElement.children).indexOf(this.ele_selected) - 1;

        if (this.reroute_fix_curvature) {
          const numberMainPath = this.ele_selected.parentElement.querySelectorAll(".main-path").length - 1;
          numberPointPosition -= numberMainPath;
          if (numberPointPosition < 0) {
            numberPointPosition = 0;
          }
        }

        const nodeId = nodeUpdate.slice(5);
        const searchConnection = this.drawflow.drawflow[this.module].data[nodeId].outputs[output_class].connections.findIndex(function (item, i) {
          return item.node === nodeUpdateIn && item.output === input_class;
        });

        this.drawflow.drawflow[this.module].data[nodeId].outputs[output_class].connections[searchConnection].points[numberPointPosition] = { pos_x: pos_x, pos_y: pos_y };

        const parentSelected = this.ele_selected.parentElement.classList[2].slice(9);

        this.updateConnectionNodes(parentSelected);
      }

      if (e.type === "touchmove") {
        this.mouse_x = e_pos_x;
        this.mouse_y = e_pos_y;
      }
      this.dispatch('mouseMove', { x: e_pos_x, y: e_pos_y });
    }

    /* ligações de itens com cantos e não curva */
    this.editor.curvature = 0;
    this.editor.reroute_curvature_start_end = 0;
    this.editor.reroute_curvature = 0;

    this.editor.createCurvature = function (start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value) {
      var center_x = ((end_pos_x - start_pos_x) / 2) + start_pos_x;
      return ' M ' + start_pos_x + ' ' + start_pos_y + ' L ' + center_x + ' ' + start_pos_y + ' L ' + center_x + ' ' + end_pos_y + ' L ' + end_pos_x + ' ' + end_pos_y;
    }

    this.editor.line_path = 1;


    /* DRAG EVENT */

    /* CONFIGURAR ZOOM */
    // this.editor.zoom_max = 0.7; 
    // this.editor.zoom_min = 0.7000000000000001;    
    // this.editor.zoom_value = 0.7000000000000001;    
    this.editor.zoom_last_value = 0.7000000000000001;

    /* congela a tela do this.editor */
    // this.editor.editor_mode = 'fixed';

    /*
 
   criar função para setar id do banco no plugin (this.editor)
     parâmetros:
     addNode('titulo','qtde conexoes esquerda do item','qtde de conexoes direita do item',posicaoX, posicaoY,nomeDaClasse,{'campoCustomizavel':'escreva algo aqui'},HtmlDoConteudoItem )
 
 */
    var editor_ = this.editor;
    this.editor.addNodeId = async function (name, num_in, num_out, ele_pos_x, ele_pos_y, classoverride, data, html, typenode = false, id) {
      return new Promise(async (resolve, reject) => {
        // this.editor.useuuid = id;
        // const lastId = this.editor.nodeId;
        //this.editor.nodeId = id;
        // this.editor.useuuid = id;
        await editor_.getUuid(id);
        await editor_.addNode(name, num_in, num_out, ele_pos_x, ele_pos_y, classoverride, data, html, typenode = false, id);
        //this.editor.useuuid = lastId;

        resolve(true);

      });
    }

    return this.editor;

  }


  async addItemEditor(type, id, jsonLayout, pos_x_, pos_y_) { /*  json_layout ==> formato das opções contidas no item (banco de dados) para formatar o item no editor automaticamente  */

    //this.editor.addNode(title, 1, 1, 100, 200, name_, data, title);

    /* this.editor.addConnection(1, 2, "output_1", "input_1");
     this.editor.addConnection(1, 3, "output_1", "input_1"); */

    if (this.editor.editor_mode === 'fixed') {
      //return false;
    }
    var pos_x;
    var pos_y;

    if (!pos_y_ && !pos_x_) {

      pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)));
      pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)));

    } else {

      pos_x = pos_x_;
      pos_y = pos_y_;

    }



    switch (type) {
      case 'facebook':
        var facebook = `
             <div>
               <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
             </div>
             `;
        this.editor.addNode('facebook', 0, 1, pos_x, pos_y, 'facebook', {}, facebook);
        break;
      case 'slack':
        var slackchat = `
               <div>
                 <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
               </div>
               `
        this.editor.addNode('slack', 1, 0, pos_x, pos_y, 'slack', {}, slackchat);
        break;
      case 'github':
        var githubtemplate = `
               <div>
                 <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
                 <div class="box">
                   <p>Enter repository url</p>
                 <input type="text" df-name>
                 </div>
               </div>
               `;
        this.editor.addNode('github', 0, 1, pos_x, pos_y, 'github', { "name": '' }, githubtemplate);
        break;
      case 'telegram':
        var telegrambot = `
               <div>
                 <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
                 <div class="box">
                   <p>Send to telegram</p>
                   <p>select channel</p>
                   <select df-channel>
                     <option value="channel_1">Channel 1</option>
                     <option value="channel_2">Channel 2</option>
                     <option value="channel_3">Channel 3</option>
                     <option value="channel_4">Channel 4</option>
                   </select>
                 </div>
               </div>
               `;
        this.editor.addNode('telegram', 1, 0, pos_x, pos_y, 'telegram', { "channel": 'channel_3' }, telegrambot);
        break;
      case 'aws':
        var aws = `
               <div>
                 <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
                 <div class="box">
                   <p>Save in aws</p>
                   <input type="text" df-db-dbname placeholder="DB name"><br><br>
                   <input type="text" df-db-key placeholder="DB key">
                   <p>Output Log</p>
                 </div>
               </div>
               `;
        this.editor.addNode('aws', 1, 1, pos_x, pos_y, 'aws', { "db": { "dbname": '', "key": '' } }, aws);
        break;
      case 'log':
        var log = `
                 <div>
                   <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
                 </div>
                 `;
        this.editor.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log);
        break;
      case 'google':
        var google = `
                 <div>
                   <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
                 </div>
                 `;
        this.editor.addNode('google', 1, 0, pos_x, pos_y, 'google', {}, google);
        break;
      case 'email':
        var email = `
                 <div>
                   <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
                 </div>
                 `;
        this.editor.addNode('email', 1, 0, pos_x, pos_y, 'email', {}, email);
        break;
      case 'received':
        var template = `
                     <div>
                       <div class="title-box"><i class="fas fa-code"></i>`+ title + `</div>
                       <div class="box">
                         Mensagem Recebida:
                         <textarea onkeydown='updateIntent(this);' df-template></textarea>
                       
                       </div>
                     </div>
                     `;
        this.editor.addNode('template', 1, 1, pos_x, pos_y, 'template', { "template": 'Write your template' }, template);
        break;
      case 'multiple':
        var multiple = `
                 <div>
                   <div class="box">
                     Multiple!
                   </div>
                 </div>
                 `;
        this.editor.addNode('multiple', 3, 4, pos_x, pos_y, 'multiple', {}, multiple);
        break;
      case 'personalized':
        var personalized = `
                 <div>
                   Personalized
                 </div>
                 `;
        this.editor.addNode('personalized', 1, 1, pos_x, pos_y, 'personalized', {}, personalized);
        break;
      case 'dbclick':
        var dbclick = `
                 <div>
                 <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
                   <div class="box dbclickbox" ondblclick="showpopup(event)">
                     Db Click here
                     <div class="modal" style="display:none">
                       <div class="modal-content">
                         <span class="close" onclick="closemodal(event)">&times;</span>
                         Change your variable {name} !
                         <input type="text" df-name>
                       </div>
     
                     </div>
                   </div>
                 </div>
                 `;

        var name_ = type + '_' + id;
        this.editor.addNode(name_, 1, 1, pos_x, pos_y, name_, { name: '' }, dbclick);
        break;

      case 'buttons':
        var buttons = await this.getTamplate(type, id); /* informar o tipo de item e o id (registro no banco de dados) */

        var name_ = type + '_' + id;
        var name_id = id;

        this.editor.addNodeId(name_, 1, 1, pos_x, pos_y, name, { 'id_abresp': name_id }, buttons, false, id);
        formatButtonsLayout(id); /* aplicar eventos aos botoes e inputs */
        break;
      case 'msgText':
        var dbclick = `<div>
                      <div class="title-box"><i class="fas fa-code"></i>Mensagem de Texto</div>
                      <div class="box" style="font-size:12px;">

                        <p>Disparar com o valor:</p>
                        <select df-channel>
                          <option value="channel_1">Botão1</option>
                          <option value="channel_2">Botão2</option>
                          <option value="channel_3">Botão3</option>
                        </select>
                        </br>
                        Mensagem:
                        <textarea df-template></textarea>
                      
                      </div>
                    </div>
                    `;
        this.editor.addNode('dbclick', 1, 1, pos_x, pos_y, 'dbclick', { name: '' }, dbclick);
        break;
      case 'msgFile':

        var msgFile = await this.getTamplate(type, id); /* informar o tipo de item e o id (registro no banco de dados) */

        var name_ = type + '_' + id;

        this.editor.addNodeId(name_, 1, 0, pos_x, pos_y, name_, { 'id_abresp': id }, msgFile, false, id);

        break;

      case 'start':

        var start = await this.getTamplate(type, id); /* informar o tipo de item e o id (registro no banco de dados) */

        var name_ = type + '_' + id;

        this.editor.addNodeId(name_, 1, 1, pos_x, pos_y, name_, { 'id_abresp': id }, start, false, id);

        break;
      case 'message':

        var message = await this.getTamplate(type, id); /* informar o tipo de item e o id (registro no banco de dados) */

        var name_ = type + '_' + id;

        this.editor.addNodeId(name_, 1, 1, pos_x, pos_y, name_, { 'id_abresp': id }, message, false, id);

        break;

      case 'atendente':

        var atendente = await this.getTamplate(type, id); /* informar o tipo de item e o id (registro no banco de dados) */

        var name_ = type + '_' + id;

        this.editor.addNodeId(name_, 1, 0, pos_x, pos_y, name_, { 'id_abresp': id }, atendente, false, id);

        break;

      default:
    }

  }


  async getTamplate(type, id) {

    return new Promise(async (resolve, reject) => {

      var tamplate;

      switch (type) {
        case 'message':

          tamplate = `
                            <div>
                            <div class="title-box"><i class="fas fa-mouse">
                                </i> Mensagem de Texto </div>
                              <div class="box dbclickbox" >

                                    <div  style="margin-bottom: 10px;">
                                            <label>
                                                Conteúdo da Mensagem:
                                            </label>

                                            <textarea col="30" id="msg_content_${id}" df-template></textarea>

                                    </div>
                                    <div class="field_wrapper_${id}">
                                        <div   >

                                            <!-- hiden identifica tipo de item: msg, button, msg button etc... -->
                                            <input id="type_item_${id}" type="hidden" value="message">
                                                                                        
                                        </div>

                                        <div  style="margin-bottom: 10px;">
                                              <button title="Salvar Alterações." onClick="setupValueInputData(${id});" type="button"  class="btn btn-success waves-effect waves-float btn-sm col-12 " style="font-size:11px; background-color: #87e692 !important;" >
                                                Salvar
                                              </button>
                                        </div>
                                      
                                      
                                    </div>

                                    <div  >
                                        
                                        

                                    </div>

                              </div>
                            </div>
                            `;
          resolve(tamplate);
          break;
        case 'msgFile':

          tamplate = `<div>
                          <div class="title-box"><i class="fas fa-code"></i>Mensagem com Arquivo</div>
                          <div class="box" style="font-size:12px;">

                            <div  style="margin-bottom: 10px;">

                                <label>
                                    Conteúdo da Mensagem:
                                </label>
                                <textarea onBlur='updateResponse(this,${id});' id="msg_content_${id}" df-template></textarea>

                            </div>
                            <div  style="margin-bottom: 10px;">

                                    <!-- hiden identifica tipo de item: msg, button, msg button etc... -->
                                    <input id="type_item_${id}" type="hidden" value="${type}">                                        
                         
                            </div>

                            <div  style="margin-bottom: 10px;">
                                <a class="btn btn-info waves-effect waves-float btn-sm col-12" href="#" onClick="filesModal(${id});" data-toggle="tooltip" data-placement="top" title="" data-original-title="Chat">                       
                                    <i style="margin-right: 8px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                    </i>
                                    <span>&nbsp;    Enviar Arquivo</span>
                                </a>

                            </div>

                            <div  style="margin-bottom: 10px;">
                                  <button title="Salvar Alterações." onClick="setupValueInputData(${id});" type="button"  class="btn btn-success waves-effect waves-float btn-sm col-12 " style="font-size:11px; background-color: #87e692 !important;" >
                                    Salvar
                                  </button>
                            </div>
                          </div>
                        </div>
                        `;

          resolve(tamplate);

          break;
        case 'buttons':

          tamplate = `
              <div>
              <div class="title-box"><i class="fas fa-mouse">
                  </i> Botões de Resposta </div>
                <div class="box dbclickbox" >


                      <div  style="margin-bottom: 10px;">
                           
                              <label>
                                  Título
                              </label>

                              <input type="text" value="" id="titulo_btn_${id}">

                      </div>
                      <div  style="margin-bottom: 10px;">
                          <label>
                          Conteúdo da Mensagem:
                          </label>

                          <textarea col="30" id="msg_content_${id}" df-template></textarea>
                      </div>
                      <div class="field_wrapper_${id}">
                          <div  style="margin-bottom: 10px;">

                              <label>
                                  Botões
                              </label>

                              <!-- hiden identifica tipo de item: msg, button, msg button etc... -->
                              <input id="type_item_${id}" type="hidden" value="button">
                                  
                           
                          </div>

                          <div  id="add_relac_button" style="display:none;">

                              <button title="Responder com componente de botões." type="button" ng-click="addControls('start');" class="btn btn-flat-success waves-effect waves-float waves-light btn-sm " style="font-size:8px;" >
                                Inicio
                              </button>
                              <button title="Responder com mensagem de texto." type="button" ng-click="addControls('start');" class="btn btn-flat-warning waves-effect waves-float waves-light btn-sm " style="font-size:8px;" >
                                Msg Texto
                              </button>
                              <button title="Responder com mensagem de texto e midia." type="button" ng-click="addControls('start');" class="btn btn-flat-info waves-effect waves-float waves-light btn-sm " style="font-size:8px;" >
                                Msg+Midia
                              </button>
                              <button title="Responder com envio de arquivo." type="button" ng-click="addControls('start');" class="btn btn-flat-danger waves-effect waves-float waves-light btn-sm " style="font-size:8px;" >
                                Arquivo
                              </button>

                        </div>
                         
                      </div>

                      <div  style="margin-bottom: 10px;">
                           
                            <label class="text-center">
                                Rodapé
                            </label>

                          <input type="text" value="" id="footer_btn_${id}">

                      </div>

                      <div  style="margin-bottom: 10px;">
                            <button title="Salvar Alterações." onClick="setupValueInputData(${id});" type="button"  class="btn btn-success waves-effect waves-float btn-sm col-12 " style="font-size:11px; background-color: #87e692 !important;" >
                              Salvar
                            </button>
                      </div>


                </div>
              </div>
              `;

          resolve(tamplate);
          break;
        case 'start':

          let start = `<div>
                  <div class="box">
                    Inicio id: ${id}

                    <!-- hiden identifica tipo de item: msg, button, msg button etc... -->
                    <input id="type_item_${id}" type="hidden" value="start">

                    <div  style="margin-bottom: 10px;">
                            <label>
                                Abordagem (mensagem):
                            </label>

                            <textarea col="30" id="msg_content_${id}" df-template></textarea>

                    </div>

                    <div  style="margin-bottom: 10px;">
                          <button title="Salvar Alterações." onClick="setupValueInputData(${id});" type="button"  class="btn btn-success waves-effect waves-float btn-sm col-12 " style="font-size:11px; background-color: #87e692 !important;" >
                            Salvar
                          </button>
                    </div>

                  </div>
                </div>`;

          resolve(start);
          break;
        case 'atendente':

          tamplate = `
                          <div>
                          <div class="title-box"><i class="fas fa-mouse">
                              </i> Direcionar p/ Atendente </div>
                            <div class="box dbclickbox" >

                                  <div  style="margin-bottom: 10px;">

                                      <div class="border" style="border-radius: 5%; box-shadow: 6px 8px 6px -3px #988aa6; background-color:#fff;">
                                          <img class="cursor-pointer" src="tamplate/app-assets/images/icon_controles/call-center.png" alt="avatar" width="144" height="124">
                                      </div>

                                  </div>
                                  <div  style="margin-bottom: 10px;">
                                          <label>
                                              Informar ao contato:
                                          </label>

                                          <textarea col="30" row="6" id="msg_content_${id}" df-template></textarea>

                                  </div>
                                  <div class="field_wrapper_${id}">
                                      <div   >

                                          <!-- hiden identifica tipo de item: msg, button, msg button etc... -->
                                          <input id="type_item_${id}" type="hidden" value="${type}">
                                                                                      
                                      </div>

                                      <div  style="margin-bottom: 10px;">
                                            <button title="Salvar Alterações." onClick="setupValueInputData(${id});" type="button"  class="btn btn-success waves-effect waves-float btn-sm col-12 " style="font-size:11px; background-color: #87e692 !important;" >
                                              Salvar
                                            </button>
                                      </div>
                                    
                                    
                                  </div>

                                  <div  >
                                      
                                      

                                  </div>

                            </div>
                          </div>
                          `;
          resolve(tamplate);

          break;
        default:
      }

      console.log("\r\n nenhum tamplate encontrado para o item: ", id);
      resolve('');



    });
  }

  getEvents() {

    var socket_ = this.socket;


    // Events!
    this.editor.on('nodeCreated', function (id) {
      console.log("Node created " + id);
    })

    /*  this.editor.on('nodeRemoved', async function(id) {
          console.log("Node removed " + id);
         
          //await $scope.remove(id);

          //await $scope.removeResposta(id);

         
      }) */

    /*    this.editor.on('nodeSelected', function(id) {
            console.log("Node selected " + id);
        }) */

    this.editor.on('moduleCreated', function (name) {
      console.log("Module Created " + name);
    })

    this.editor.on('moduleChanged', function (name) {
      console.log("Module Changed " + name);

      socket_.emit('moduloSelect', JSON.stringify({ 'dados': name }));
    })

    /*  this.editor.on('connectionCreated', async function(relacao) {
          console.log('Connection created');
          console.log(relacao);

          if(relacao.output_id){
            var id_resp = relacao.input_id;
            var id_intent = relacao.output_id;
            var atualizar = {
              'id_intent':id_intent
            }
          // await $scope.updateResponse(atualizar,id_resp);
          }
          
      }) */

    /*   this.editor.on('connectionRemoved', async function(relacao) {
           console.log('Connection removed');
           console.log(relacao);
         
           if(relacao.output_id){
             var id_resp = relacao.input_id;
             var id_intent = relacao.output_id;
             var atualizar = {
               'id_intent':null 
             }
           // await $scope.updateResponse(atualizar,id_resp);
           }

       }) */

    this.editor.on('mouseMove', async function (position) {
      console.log('Position mouse x:' + position.x + ' y:' + position.y);
      console.log(position);

      x = position.x;
      y = position.y;

      socket_.emit('mousemove', JSON.stringify({ 'dados': x + y }));
      return x + y;
    })

    let exp = this.editor.export();

    /* this.editor.on('nodeMoved', async function(id) {
         console.log("Node moved " + id);

         var exportdata = exp; 
         var item_ = exportdata.drawflow.Home.data[id];  
         
         if(!item_){

             console.log("\r\n Não exste itens para verificar dados de posicionamento.")
             return;
         }
         
         var posx_ = item_.pos_x;
         var posy_ = item_.pos_y;
         var dados_ = {'posx':posx_,'posy':posy_};

         if(item_.class.indexOf('Intent') != -1){
           
         // await $scope.updateIntent(dados_,id);

         }else if(item_.class.indexOf('Response') != -1){
           
         // await $scope.updateResponse(dados_,id);

         }

         socket_.emit('nodemove',JSON.stringify({'dados':posx_}));
         return "moveu";
     }) */

    this.editor.on('zoom', function (zoom) {
      console.log('Zoom level ' + zoom);

    })

    this.editor.on('translate', function (position) {
      console.log('Translate x:' + position.x + ' y:' + position.y);
    })

    this.editor.on('addReroute', function (id) {
      console.log("Reroute added " + id);
    })

    this.editor.on('removeReroute', function (id) {
      console.log("Reroute removed " + id);
    })



  }


  eventor() {

    return this.event;

  }


  eventoTimer() {


    var cont = 0;


    //  console.log("\r\n Socket: ", this.socket);

    var socket_ = this.socket;

    setInterval(function () {
      cont = cont + 1
      //console.log(cont);

      //socket_.emit('contando',JSON.stringify({'dados':cont}));

      // console.log("\r\n Contador dentro do interval: ", cont);

    }, 1000);


  }

  async requestPost(params, rota) {

    return new Promise(async (resolve, reject) => {

      if (params) {


        console.log("\r\n Parametros para o post: ", params);

        try {

          const response = await axios.post(`${this.base_url}editor/setupIntent`, params);
          const retorno = response.data.retorno;

          console.log(`\r\n requisção post realizada.`, retorno);
          resolve(retorno);
          return;

        } catch (errors) {
          console.error("Ocorreu um erro ao tentar atualizar a intent: ", errors);

          resolve(false);
          return;
        }

      } else {

        console.log("\r\n Por favor informe parametros para requisição post.");
        resolve(false);

      }

    });
  }


  initSocket() {

    return new Promise(async (resolve, reject) => {

      this.socket = io(this.base_url, { transports: ['websocket', 'polling', 'flashsocket'], autoConnect: true });

      this.socket.on('connect', function (data) {


        console.log("\r\n Servidor socket inicializado: ", data);


      });


      /* desconectar-se */
      this.socket.on('disconnect', () => {
        console.log('\r\n Socket desconectado.');
      });

      this.socket.on('error', function (e) {

        console.log('\r\n Ocorreu um erro ao enviar dados via socket: ' + e);

      });

      /* eventos */
      var socket_ = this.socket;

      setInterval(function () {
        cont = cont + 1
        //console.log(cont);

        socket_.emit('contando', JSON.stringify({ 'dados': cont }));

        // console.log("\r\n Contador dentro do interval: ", cont);

      }, 1000);


      resolve(this.socket);

    });

  }



}