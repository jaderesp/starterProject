'use strict'
let loginCtr = require('../../controllers/front/Login_controller');
const util = require('../../controllers/utils/Utils_controller');

let usuario = require('../../controllers/bd/Usuario_controller')
const base_url = util.baseUrl;

/* exibir pagina de login */
/* paginas http-front */
exports.login = async function (req, res) {

    console.log("rota login acionada...")


    /* criar um usuario padrão (só pra testes) */
    //await usuario.createDefaultUser();

    /* inicializar valores na pagina */
    let data = { instancia: '', qrcode: '----', status: false };
    let log = {};
    log.session = req.session.perfil;

    /* verificar se esta logado */
    if (log.session) {

        return res.render('home/index', { 'usuario': log.session, 'dados': data, 'baseUrl': base_url, 'apiUrl': util.apiUrl });

    } else {

        return res.render('login/index', { 'baseUrl': base_url, 'apiUrl': util.apiUrl, 'error': true });

    }

}


exports.auth = async (req, res) => {

    let params = req.body;
    let retorno = false;
    /* inicializar valores na pagina */
    let data = { instancia: '', qrcode: '', status: false };
    retorno = await loginCtr.login(params);



    if (retorno !== false) {

        if (retorno.login == true) {

            req.session.perfil = retorno; /* dados recuperados do banco */


            /* testando api do gateway de pagamento */
            /*await teste.add();
                
            await teste.listar();

            let cliente = {
                name: 'Miguel Pereira Almeida', 
                cpfCnpj: '975.477.550-89',
                email: 'miguel@dominio.com.br',
                mobilePhone: '16993860387',
                company: 'JMSofts Soluções'
            };
            await teste.editar('cus_000004767849',cliente);

            await teste.remove('cus_000004767849'); */

            /* redirecionar para home */
            return res.render('home/index', { 'usuario': req.session.perfil, 'dados': data, 'baseUrl': base_url, 'apiUrl': util.apiUrl });
            //res.redirect('/login');


        } else {
            /** errono login */
            return res.render('login/index', { 'baseUrl': base_url, 'apiUrl': util.apiUrl, 'error': true }); /* retornar para login */
        }

    } else {

        /** errono login */
        return res.render('login/index', { 'baseUrl': base_url, 'apiUrl': util.apiUrl, 'error': true }); /* retornar para login */

    }


}

/* verificar se logado */
exports.verifyLogged = async function (req, res) {

    /* inicializar valores na pagina */
    let data = { instancia: '', qrcode: '----', status: false };
    let log = {};
    log.session = req.session.perfil;

    /* verificar se esta logado */
    if (log.session) {

        return res.send({ 'logged': true });

    } else {

        return res.send({ 'logged': false });

    }

}