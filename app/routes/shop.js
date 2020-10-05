const Propriedade = require('../models/propiedade');
const express = require('express'),
    router = express.Router();

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
router.post('/contato', validators.contato.contato, shopCtrl.contato.postContato);

router.get('/retonajsonpropriedade/:id', (req, res) => {
    let id = req.params.id;
    let propriedade = Propriedade.findById({_id: id});
    res.json(propriedade);
});

module.exports = router;