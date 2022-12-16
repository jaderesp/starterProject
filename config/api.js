'use strict' 
/* link de referencia: https://github.com/open-wa/wa-automate-nodejs/issues/563#issuecomment-647030529 */

var configs = {  
  "files": {
        "return_patch_files": true, /* ao retornar arquivos recebidos nas mensagens - retornar false=base64 ou true= diretorio local do arquivo  */
        "send_patch_files":true, /* no envio de arquivos para mensagens, false = base64 e true= url do arquivo (parâmetros de envio) */
        "decript_file_chat":true /* descriptografar arquivo do chat */
  },
  "sessions": {
       "autoClose" : 1 /* minutos */
  },
  /* ==== configurar envio de post a um link ==== */
  "send_post_php":{
      "active":true,
      "post_url":{
        "link":"http://localhost/jms-wapisulla/testes/webhookNewMsg.php",
        "autenticar":false,
        "user":"",
        "passwd":""
      },
      "sendSeen":true, /* tornar nova msg recebida como lida ? */
      "sendForMe":false, /* enviar msg enviadas */
      "sendForGroups":false,
      "sendForListTransm":false,
      "sendForStatus":false
  },
  "sendSeen":false, 
  "send_action_message":{
    "active":false,
    "post_url":{
      "link":"http://localhost/jms-wapisulla/testes/webhookActionsdMsg.php",
      "autenticar":false,
      "user":"",
      "passwd":""
    }
  },
    "send_notify_msg":{ /* notificações de ocorrencias de mensagens (voz, mensagem) chamadas perdidas */
      "active":false,
      "post_url":{
        "link":"http://localhost/jms-wapisulla/testes/webhookNotifyMsg.php",
        "autenticar":false,
        "user":"",
        "passwd":""
      },

    }, 
    "send_status_session":{ /* status da sessão */
      "active":false,
      "post_url":{
        "link":"http://localhost:8090/sgp-whatsapp/public/WebHook/setInstanceStatus",
        "autenticar":false,
        "user":"",
        "passwd":""
      },

    }    
   
};

configs.sessions.autoClose = (configs.sessions.autoClose) * 60000; /* converter minutos em milisegundos */
 
 module.exports = configs;
