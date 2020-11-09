const Propriedade = require('../models/propiedade');
const express = require('express'),
    router = express.Router();
const request = require('request');

const validators = {
    contato: require('../middleware/validators/contato')
}

const shopCtrl = {
    contato: require('../controllers/shop/contato'),
    sobre: require('../controllers/shop/sobre'),
    documentos: require('../controllers/shop/documentos'),
    propriedade: require('../controllers/shop/propriedade'),
    index: require('../controllers/shop/index')
}

router.get('/', shopCtrl.index.getIndex);

router.get('/sobre', shopCtrl.sobre.getSobre);

router.get('/documentos', shopCtrl.documentos.getDocumentos);

router.get('/comprar', shopCtrl.propriedade.getComprar);

router.get('/alugar', (req, res, next) => res.redirect('/comprar?genero=Aluguel'));

router.get('/propriedade/:propCod', shopCtrl.propriedade.getPropiedade);

router.post('/interesse', validators.contato.interesse, shopCtrl.contato.postInteresse);

router.get('/vender', shopCtrl.contato.getVender);
router.post('/vender', validators.contato.vender, shopCtrl.contato.postVender);

router.get('/contato', shopCtrl.contato.getContato);
//router.post('/contato', validators.contato.contato, shopCtrl.contato.postContato);

//verifica se o envio do formulário foi feito por robo, se passar envia o email
router.post('/contato', shopCtrl.contato.postContatoRecaptcha); 

//rotas para redefinir tipo salao quando for para produção
router.get('/redefinirsalao', shopCtrl.propriedade.redefinirSalao);
router.get('/mostrasalao', shopCtrl.propriedade.mostraSalao);
router.get('/mostrarbairro', shopCtrl.propriedade.mostrarbairro);

module.exports = router;