const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    mongoDBSession = require('connect-mongodb-session')(session);
    path = require('path'),
    express = require('express'),
    app = express(),
    MONGO_URI = require('./app/util/mongo_URI'),
    csurfProtection = require('csurf')({
        cookie: true
    }),
    setLocals = require('./app/middleware/set-locals'),
    isAuth = require('./app/middleware/is-auth'),
    multer = require('./app/middleware/multer'),
    sitemapGenerator = require('./app/util/sitemap'),
    fileHelper = require('./app/util/file-helper'),
    fs = require('fs'),
    nodeCron = require('node-cron');

require('dotenv').config(); 

app.set('view engine', 'ejs');
app.set('views', 'app/views');

//setting mongodb session 
const storeSession = new mongoDBSession({
    uri: MONGO_URI,
    collect: 'sessions'
});

//seting app middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'A vida é muito coolzástica',
    resave: false,
    saveUninitialized: false,
    store: storeSession,
    cookie: {
        // maxAge: 60 * 60 * 24 * 30 * 1000    
        maxAge: 3600 * 1000 //1 hora em milisegundos
    }
}));
app.use(multer.single('image'));

app.use(csurfProtection);
app.use(express.static(path.join(__dirname, 'app/public')));

const shopRoutes = require('./app/routes/shop');
app.use(shopRoutes);

const adminRoutes = require('./app/routes/admin');
const authRoutes = require('./app/routes/auth');
const errorRoutes = require('./app/controllers/error/server');

app.use(authRoutes);
app.use(adminRoutes);
app.use(errorRoutes.get404);
app.use(errorRoutes.get500);

// Sitemap task
sitemapGenerator()
nodeCron.schedule('0 0 0 * * *', function () {
    sitemapGenerator();
    //implementar a funcionalidade de mudar os usuarios muitos ativos
});

//starting server
const connection = mongoose.connect(MONGO_URI, {
    useNewUrlParser: true
})
    .then((resul) => { })
    .then(resul => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err));

module.exports = connection;

/*
------------------------------NOTAS DE ATUALIZAÇÕES------------------------

****01/10/2020**** 
MODULO DE USUARIOS - CRUD DE USER / ATIVO E INATIVO  E VALIDAÇÃO DA OPERAÇÃO POR USUARIO
ONDE APENAS 2 USUARIOS PODEM FAZER OPERAÇÕES NO USER PAGE - PLANAGROADMIN E THALESSALAZAR

MOUDELO DE VIDEO DE YOUTUVE DE TOUR PELO IMOVEL

****02/10/2020****
CORREÇÃO DOS DETALHES DO IMÓVEL EM VERSÃO MOBILE EM SHOP/propriedade

CORREÇÃO MENU A EMPRESA/DOCUMENTOS NECESSÁRIOS

DESTAQUE NO PREÇO DO IMOVEL NO CARD NAS LISTAGENS

****05/10/2020****
DESTAQUE NO PREÇO DO IMOVEL NA PROPRIEDADE MBOILE E DESKTOP
INICO DO DESENVOLVIMENTO DE BANNERS COM UPLOAD DE IMAGENS PELO ADMIN

****09/10/2020****
BANNER COMPRA IMG ENTRE IMOVEIS NA LISTAGEM
TAMANHO BANNER COMPRA: 1290 X 300
FINALIZAÇÃO DO MODULO DE BANNER X ROTAS X LAYOUT

****13/10/2020****
FINALIZAÇÃO DO MODAL DE GALERIA NA /PROPRIEDADE DO SHOP
---------------------------------------------------------------------------

*/