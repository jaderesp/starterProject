'use strict'
const express = require('express'); /* criar app mvc */
var app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const cors = require('cors');
const router = express.Router(); /* navegação web pelos diretorio(link) da aplicação */
var path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const confEnv = process.env;

app.set('views', './src/views') /* localidade das views */
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

/* sessao */
/* sessao config */
app.use(session({
    name: 'wapi_conn',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 720 * 60 * 1000 } /* 720 minutos = 12 horas */
}));

/* importar rotas */
/* whatsapp page instanciada */
const front_route = require('./front/index');
const bd_route = require('./bd/index');
const readerFiles = require('./arquivos/index');


exports.rotas = async function () {
    return new Promise(async (resolve, reject) => {


        /* CORS */
        var allowlist = [confEnv.baseURL, 'https://watszap.com.br']
        var corsOptions = {
            origin: allowlist,
            origin: true,
            optionsSuccessStatus: 200 // For legacy browser support
        }

        app.use(cors(corsOptions));

        /* adicionar body-parser no app, para que toda requisição o result seja convertido para formato json -automaticamente */
        app.use(bodyParser.json({ limit: '150mb' }));
        app.use(bodyParser.urlencoded({
            extended: false,
            limit: '1024mb'
        }));



        /* gerar acesso a pasta public (visualizar arquivos front = imagens) */
        var dir = path.join(__dirname + '/../../', 'public');
        app.use(express.static(dir, { dotfiles: 'allow' }));

        /* pasta front */
        app = await front_route.routes(app);

        /* reader files */
        app = await readerFiles.routes(app);

        /* bd rotas */
        app = await bd_route.routes(app);


        resolve(app);


    });

}
