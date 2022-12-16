

class itemsSetup {
    json_data;

    constructor() {
        this.json_data = JSON.parse(`{
                "layout": {
                  "message": {
                       "msg":""
                  },
                  "msgFile": {
                      "msg":"",
                      "nameFile":"",
                      "fileDir":""
                  },
                  "button":     
                    {
                            "msg":"",  
                            "useTemplateButtons": true,
                            "buttons": [
                    
                            ],
                            "text":"",
                            "footer":""
                    },
                    "btnList": {
                
                    },
                  "atendente": {
                        "msg":""
                  },
                  "start": {
                        "msg":""
                  }
                },
                "relaciona": []
              }`);


    }


    /* exemplo:    getJsonData(21,23,'remove','button') = remover um botão do objecto */
    async getJsonData(output_id, input_id, action) {

        /* 
                params: 
                    action = tipo de verificação:   add (se não existir adicionar), remove (se existir, remover)
        
        */

        return new Promise(async (resolve, reject) => {


            /* verificar se já tem dados relacionais resgatar, alterar e atualizar */
            let params = { 'id_abresp': output_id };
            let itemBD = await postIn(params, 'get');


            this.json_data.relaciona = await this.getJsonRelaciona(itemBD, output_id, input_id, action);

            this.json_data.layout = await this.getJsonLayout(itemBD, output_id, input_id, action);

            resolve(this.json_data);

        });

    }

    async getJsonRelaciona(data, output_id, input_id, action) {

        return new Promise(async (resolve, reject) => {

            var json_data = this.json_data;

            /* s enão existir os dois ids, não pode existir relacionamento retornar vazio */
            if (!output_id && !input_id) {
                resolve([]);
                return;
            }

            /* se já existir dados relacionais no item, acrescentar */
            if (data.length > 0) {

                let jdata = JSON.parse(data[0].json_data);
                let relaciona = [];

                if (!jdata.relaciona == false) {

                    relaciona = jdata.relaciona;

                }

                if (relaciona.length > 0) {

                    var exist = false;
                    for (var i = 0; i < relaciona.length; i++) {

                        if (relaciona[i].origem == output_id && relaciona[i].destino == input_id) {
                            exist = true;

                            /* se existir relacionamento e opção action for remover, então remover  */
                            if (action == 'remove') {

                                relaciona.splice(i, 1); /* remover conexão */

                            }

                            break;
                        }

                    }




                    /* se não existir relacionamento identico, e opção action for nula, então adicionar */
                    if (exist == false && !action && output_id && input_id) {

                        relaciona.push({ 'origem': output_id.toString(), 'destino': input_id.toString(), 'se_valor': input_id.toString() });

                    }


                    json_data.relaciona = relaciona;


                } else {

                    if (output_id && input_id) {

                        json_data.relaciona = [{ 'origem': output_id.toString(), 'destino': input_id.toString(), 'se_valor': input_id.toString() }];

                    }

                }

            } else {

                /* s enão existir os dois ids, não pode existir relacionamento retornar vazio */
                if (output_id && input_id) {

                    json_data.relaciona = [{ 'origem': output_id.toString(), 'destino': input_id.toString(), 'se_valor': input_id.toString() }]; /* se a mensagem vier do id_abresp = e o valor for ..., então disparar mensagem de destino */

                }



            }

            resolve(json_data.relaciona);

        });

    }


    async getJsonLayout(data, output_id, input_id, action) {

        /* 
            type = message, msgFile, button, btnList
        */

        return new Promise(async (resolve, reject) => {

            var layout = {};
            var result = {};

            if (data.length > 0) {

                let jdata = JSON.parse(data[0].json_data);


                if (!jdata.layout == false) {

                    layout = jdata.layout;

                } else {

                    layout = this.json_data.layout;

                }

            }


            var type = $('#type_item_' + output_id).val();
            /* pegar dados dos inputs conforme o type
                ids dos inputs:

                type (valor do hidden de tipo de item) = '#type_item_${id}'

                message = '#msg_content_${id}'
                msgFile = '#'
                button = '#input_btn_${id}'

            */

            console.log("\r\n Tipo de itens para formar layout do object: ", type);

            switch (type) {

                case 'message':

                    /* pegar ttulo e footer referente ao id do item (output_id) */
                    let msgTxt = $('#msg_content_' + output_id).val();

                    layout.message.msg = msgTxt;

                    result = { "message": layout.message };

                    break;
                case 'msgFile':

                    /* pegar ttulo e footer referente ao id do item (output_id) */
                    let msgF = $('#msg_content_' + output_id).val();

                    layout.msgFile.msg = msgF;

                    result = { "msgFile": layout.msgFile };

                    break;
                case 'button':

                    let title_input = '';

                    /* tratar valor dos botões (dinamicos do item node) */
                    if (input_id && output_id) {

                        /* ==== tratativa dos imputs contidos no itens (output_id) ===== */
                        let idUnico = output_id.toString() + input_id.toString();
                        let input = $('#input_btn_' + idUnico);



                        /* adicionar valor aos inputs referente a conexão de origem */
                        if (input.is(':visible') == true) {

                            title_input = input.val();

                        }

                    }

                    /* pegar ttulo e footer referente ao id do item (output_id) */
                    let msg = $('#msg_content_' + output_id).val();
                    let titulo_btn = $('#titulo_btn_' + output_id).val();
                    let footer_btn = $('#footer_btn_' + output_id).val();


                    /* tratar botões */
                    let botoes = [];

                    if (!layout.button == false) {

                        botoes = layout.button.buttons;

                    }

                    let btnExist = false;
                    for (var i = 0; i < botoes.length; i++) {

                        if (parseInt(JSON.parse(botoes[i].id)) == input_id) {
                            btnExist = true;

                            if (!action && title_input) {

                                botoes[i].text = title_input; /* atualizar o título do botão */

                            }

                            if (action == 'remove') {

                                botoes.splice(i, 1); /* remover registro de botão do layout */

                            }

                        } else if (!botoes[i].id) {

                            btnExist = true; /* sinalizar que existe para não criar botão nulo, na proxima codição */
                            botoes.splice(i, 1); /* remover registro de botão do layout */

                        }

                    }

                    if (btnExist == false && !action && input_id && title_input) {

                        botoes.push({ "id": '"' + input_id + '"', "text": title_input });

                    }


                    layout.button.buttons = botoes; /* removeu um item, atualizar todo layout buttons */


                    layout.button.msg = msg;
                    layout.button.title = titulo_btn;
                    layout.button.footer = footer_btn;

                    result = { "button": layout.button };

                    break;
                case 'btnList':


                    break;
                case 'atendente':

                    /* pegar ttulo e footer referente ao id do item (output_id) */
                    var msg_ = $('#msg_content_' + output_id).val();

                    layout.atendente.msg = msg_;

                    result = { "atendente": layout.atendente };

                    break;
                case 'start':

                    /* pegar ttulo e footer referente ao id do item (output_id) */
                    var msg_ = $('#msg_content_' + output_id).val();

                    layout.start.msg = msg_;

                    result = { "start": layout.start };

                    break;
                default:

            }

            resolve(result);

        });

    }

    /* preencher os dados nos inputs dos items (nodes) */
    async setValuesIntoInputs() {

        return new Promise(async (resolve, reject) => {

            /* pegar todos os registros no banco de dados */
            let itemBD = await postIn({}, 'get');


            for (var i = 0; i < itemBD.length; i++) {


                if (itemBD[i]) {

                    let id = itemBD[i].id_abresp;
                    /* pegar valor para preencher as opções */
                    let jdata = JSON.parse(itemBD[i].json_data);
                    let layout = [];

                    if (!jdata.layout == false) {

                        layout = jdata.layout;

                    }


                    if (itemBD[i].type == 'start') {

                        if (layout.start) {
                            /* preenher título e o footer do item button */
                            $('#msg_content_' + id).val(layout.start.msg);

                        }


                    }

                    if (itemBD[i].type == 'message') {

                        if (layout.message) {
                            /* preenher título e o footer do item button */
                            $('#msg_content_' + id).val(layout.message.msg);

                        }


                    }

                    if (itemBD[i].type == 'msgFile') {

                        if (layout.msgFile) {
                            /* preenher título e o footer do item button */
                            $('#msg_content_' + id).val(layout.msgFile.msg);

                        }

                    }

                    if (itemBD[i].type == 'buttons') {

                        let valorInput = "";

                        /* preencher dados do botão referente ao idUnico */
                        if (layout.button) {

                            let btns = layout.button.buttons;

                            for (var x = 0; x < btns.length; x++) {

                                if (btns[x].id) {
                                    valorInput = btns[x].text;
                                    /* (id do registro id_abres, id relac de destino) */
                                    let idUnico = id + JSON.parse(btns[x].id).toString(); /* id dos imputs buttons (dinamicos) */

                                    $('#input_btn_' + idUnico).val(valorInput); /* preencher dados dos inputs de botoes dinamicos */
                                }

                            }

                            /* preenher título e o footer do item button */
                            $('#msg_content_' + id).val(layout.button.msg);
                            $('#titulo_btn_' + id).val(layout.button.title);
                            $('#footer_btn_' + id).val(layout.button.footer);

                        }

                    }

                    if (itemBD[i].type == 'atendente') {

                        if (layout.atendente) {
                            /* preenher título e o footer do item button */
                            $('#msg_content_' + id).val(layout.atendente.msg);

                        }


                    }




                }


            }

            resolve(true);

        })

    }



}