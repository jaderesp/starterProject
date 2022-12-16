'use strict'
const util = require('../controllers/utils/Utils_controller');

/* verificar token válido */
module.exports.verifyTrialUser = async (req, res, next) => {

    return new Promise(async (resolve, reject) => {

        let data = { instancia: '', qrcode: '--', status: false };
        let log = { 'session': null }
        log.session = req.session.perfil;
        let logged = req.session.perfil;

        /* verificar se esta logado */
        if (logged) {


            /* se o contato não possui assinatura e atingiu limite de uso */
            if (logged.sessao) {

                /* direcionar para pagina logado e passar os dados de login */
                return res.render('minha_conta/index', { 'usuario': log.session, 'dados': data, 'baseUrl': util.baseUrl, 'apiUrl': util.apiUrl });

            } else {

                next();
                return;

            }

        } else {
            /* retornar para login */
            return res.render('login/index', { dados: data, 'baseUrl': util.baseUrl, 'apiUrl': util.apiUrl, 'error': false });
        }


    });

}