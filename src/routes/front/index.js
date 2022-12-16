/* organizar rotas */
/* importar rotas */
const home = require('./home-route')


const acesso = require('./login-route')

const utils = require('./utils-route');

const verifyUser = require('../../middlewares/TrialUse');


module.exports.routes = async (app) => {

    return new Promise(async (resolve, reject) => {
        /* chamadas http-pages - front */
        app.get('/', acesso.login);


        app.post('/inicialize', verifyUser.verifyTrialUser, home.inicialize);
        /* login de usuario no sistema (front) */
        app.get('/login', acesso.login);
        app.post('/auth', acesso.auth);
        app.post('/verifyLogged', acesso.verifyLogged);


        /* logoff session no front */
        app.post('/logoff', home.logoff);

        /* utils */
        app.post('/validate/cpfCnpj', utils.validate);

        resolve(app);

    });

}