
const contatoMod = require('../../models/bd/Contato_model');
const ticketMod = require('../../models/bd/Ticket_model');
const usuarioMod = require('../../models/bd/Usuario_model');
const setorMod = require('../../models/bd/Setor_model');

/* verificar string contem dentro de uma mensagem, uma palavra ou uma combinação de palavras juntas */
/* percorrer array de string - feita pela funÃ§Ã£o separar_string();  e verificar se existe palavra chave  */
exports.verifica_arr_palchave = async (msg_,palavras_chave, type) => {

    /*
        params: 
            msg_ : mensagem recebida
            palavras_chave : palavras que devem conter dentro da mensagem
            type: tipo de consulta (todas as palavras chave devem conter na mensagem ou qualquer uma)
                  ex. true = todas devem equivalerem na mensagem
                      false = qualquer palavra que conter na mensagem retorna true
     */
    
    return new Promise( async (resolve, reject) => {
        
        var cont_iguais = 0;
        var result_ = false;

        if(!palavras_chave){
            /* nenhum valor de palavra chave */
            resolve(false);
            return;
        }
        let arr_palchaves = palavras_chave.split(" ");

        /* remover caracteres especiais da mensagem */
        let msgArr = msg_.split(' ');
        let strMsgClean = "";

        /* remover caracters palavra por palavra */
        for(var y = 0; y < msgArr.length;y++){

            strMsgClean += await remove_caracteres(msgArr[y]);
        }       
    
        for (var i = 0; i < arr_palchaves.length; i++) {

            let pchave = await remove_caracteres(arr_palchaves[i].trim());
           
            if (strMsgClean.match(pchave)){
                console.log("Encontrou a palavra: ",arr_palchaves[i])
                cont_iguais = cont_iguais + 1;
            }
    
        }
    


        if(type == true){ /* se a consulta deve equivaler todas as palavra chave dentro da mensagem */
            /* se qtde palavras chaves forem a mesma que a qtde das mesmas encontradas na msg entÃ£o true se nÃ£o false */
            if (cont_iguais == arr_palchaves.length){
                result_ = true;
            }

        }else{

            if (cont_iguais > 0){
                result_ = true;
            }
            
        }
    
        resolve(result_);

    });

}


/* remover caracteres especiais */
async function remove_caracteres(especialChar)
{
    return new Promise( async (resolve, reject) => {
        especialChar = especialChar.replace('/[Ã¡Ã Ã£Ã¢Ã¤]/ui', 'a');
        especialChar = especialChar.replace('/[Ã©Ã¨ÃªÃ«]/ui', 'e');
        especialChar = especialChar.replace('/[Ã­Ã¬Ã®Ã¯]/ui', 'i');
        especialChar = especialChar.replace('/[Ã³Ã²ÃµÃ´Ã¶]/ui', 'o');
        especialChar = especialChar.replace('/[ÃºÃ¹Ã»Ã¼]/ui', 'u');
        especialChar = especialChar.replace('/[Ã§]/ui', 'c');
        especialChar = especialChar.replace('/[^a-z0-9]/i', '_');
        especialChar = especialChar.replace('/_+/', '_');
    		
        let result = await removerAcentos(especialChar);

        if(result){
            resolve(result);
        }

    });
}

/* remover acentos */
async function removerAcentos( newStringComAcento ){
	return new Promise( async (resolve, reject) => {	
            var string = newStringComAcento.toLowerCase();
            var mapaAcentosHex = {
                a : /[\xE0-\xE6]/g,
                A : /[\xC0-\xC6]/g,
                e : /[\xE8-\xEB]/g,
                E : /[\xC8-\xCB]/g,
                i : /[\xEC-\xEF]/g,
                I : /[\xCC-\xCF]/g,
                o : /[\xF2-\xF6]/g,
                O : /[\xD2-\xD6]/g,
                u : /[\xF9-\xFC]/g,
                U : /[\xD9-\xDC]/g,
                c : /\xE7/g,
                C : /\xC7/g,
                n : /\xF1/g,
                N : /\xD1/g,
            };
        
            for ( var letra in mapaAcentosHex ) {
                var expressaoRegular = mapaAcentosHex[letra];
                string = string.replace( expressaoRegular, letra ).replace(/\W/gi,'');
            }
        	
            resolve(string);

    });
}


/* substituir vars nas strings por dados do contato */
exports.formatVarsString = async (mensagem,number, id_conta) => {

    return new Promise( async (resolve, reject) => {

            /*====== VERIFICAÇÃO DE VARIAVEL NA MENSAGEM ======= */
            /* verificar se possui variáveis na mensagem (substituir por informações como nome, telefone, endereço etc) */
            let varTexto = {    
                nome:'{nome}',                
                protocolo:'{protocolo}',
                atendente: '{atendente}',
                setor: '{setor}'
            };

            let msgFormated = null;           
            let contato_send = await contatoMod.getSomeOne({'id_conta':id_conta,'number':number});
              
            /* verificar se possui a variavel na mensagem */
            if(mensagem.indexOf(varTexto.nome.toString()) != -1){

                console.log("\r\n TRATATIVA DE VARIAVEL DE DADOS DO CONTATO: ", contato_send);
            
                let nome_ = contato_send.nome_verificado;
                let substituir = varTexto.nome;
                /* remover palavra client ou cliente do nome do contato */
                if(nome_){
                    msgFormated = mensagem.replaceAll(substituir,"*"+nome_+"*");/* substituir variável por nome do contato */
                }else{
                    
                    /* se não houver nome para substituir a variável, remover variavel {nome} */
                    msgFormated = mensagem.replaceAll(substituir,'😀');

                    console.log("\r\n "+ nome_ +" SUBSTINTUINDO COMANDO " + substituir.toString() + " NOME NA MENSAGEM POR: 😀 : \r\n", msgFormated);

                }

                /* informação de protocolo de atendimento */
            }

                       
            if(mensagem.indexOf(varTexto.protocolo.toString()) != -1){

                let ticket = await ticketMod.getSomeOne({'idContato':contato_send.idContato, 'status':'ABERTO'});

                console.log("\r\n TRATATIVA DE VARIAVEL DE PROTOCOLO: ", ticket);              

                mensagem = !msgFormated?mensagem:msgFormated;

                let substituir = varTexto.protocolo;/* variável customizada */  

                if(ticket){

                    let protocolo = ticket.protocolo;
                                      
                    
                    msgFormated = mensagem.replaceAll(substituir,"*"+protocolo+"*");

                }else{

                    msgFormated = mensagem.replaceAll(substituir,''); /* se não houver dados do ticket, limpar variavel */

                }


            }
            
            
            if(mensagem.indexOf(varTexto.atendente.toString()) != -1){
               
                let ticket = await ticketMod.getSomeOne({'idContato':contato_send.idContato, 'status':'ABERTO'});                
                let usuarioAtendente = await usuarioMod.getSomeOne({'idusuario': ticket.idusuario});

                console.log("\r\n TRATATIVA DE VARIAVEL DE DADOS DO ATENDENTE: ", usuarioAtendente);

                mensagem = !msgFormated?mensagem:msgFormated;

                let substituir = varTexto.atendente;/* variável customizada */

                if(usuarioAtendente){

                    let protocolo = usuarioAtendente.nome;
                    

                    msgFormated = mensagem.replaceAll(substituir,"*"+protocolo+"*");

                }else{

                    msgFormated = mensagem.replaceAll(substituir,''); /* se não houver dados do ticket, limpar variavel */

                }


            }

            

            if(mensagem.indexOf(varTexto.setor.toString()) != -1){
               
                let ticket = await ticketMod.getSomeOne({'idContato':contato_send.idContato, 'status':'ABERTO'});

                if(!ticket){
                    ticket = await ticketMod.getSomeOne({'idContato':contato_send.idContato, 'status':'ABERTO'});
                }
                
                let setor = await setorMod.getSomeOne({'id_setor':ticket.id_setor});
                

                console.log("\r\n TRATATIVA DE VARIAVEL DE DADOS DO SETOR: ", setor);

                mensagem = !msgFormated?mensagem:msgFormated;

                let substituir = varTexto.setor;/* variável customizada */

                if(setor){

                    let protocolo = setor.nome;
                   

                    msgFormated = mensagem.replaceAll(substituir,"*"+protocolo+"*");

                }else{

                    msgFormated = mensagem.replaceAll(substituir,''); /* se não houver dados do ticket, limpar variavel */

                }


            }
            
            if(!msgFormated){
                resolve(mensagem);
                return;
            }

             

            if(msgFormated !== null){
                resolve(msgFormated);
            }

    });
    /*====== FIM VERIFICAÇÃO DE VARIAVEL NA MENSAGEM ======= */

}