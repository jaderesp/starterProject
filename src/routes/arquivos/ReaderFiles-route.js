const reader = require('../../controllers/ReaderFiles_controller');
const util = require('../../controllers/utils/Utils_controller');

module.exports.ler = async (req, res) => {

    let params = req.body;

    let retorno = await reader.ler(params);

    res.status(200).send(retorno);

}