const asaas = require('../../controllers/asaas/Webhook_controller');

module.exports.assasWebHook = async (req, res) => {

      let received = req.body;
    
      let retorno = await asaas.asaasWebHook(received);

      res.status(200).send(retorno);

}