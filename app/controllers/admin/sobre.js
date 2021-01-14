const Sobre = require('../../models/sobre');

//GET SOBRE
exports.getSobre = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            res.render('admin/sobre/conteudosobre', {
                pageTitle: "Admnistrar Sobre",
                path: "admin/sobre",
                robotsFollow: false,
                errorMessage: [],
                sobre: sobre,
                contact: false
            });
        })
        .catch(err => next(err, 500));
};

//POST SOBRE
exports.postSobre = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            sobre.slogan = req.body.slogan;
            sobre.quemsomos = req.body.quemsomos;
            sobre.oquefazemos = req.body.oquefazemos;
            sobre.nossamissao = req.body.nossamissao;

            sobre.diferencial1 = {
                titulo: req.body.diferencial1titulo,
                desc: req.body.diferencial1desc,
            };

            sobre.diferencial2 = {
                titulo: req.body.diferencial2titulo,
                desc: req.body.diferencial2desc,
            };

            sobre.diferencial3 = {
                titulo: req.body.diferencial3titulo,
                desc: req.body.diferencial3desc,
            };

            sobre.diferencial4 = {
                titulo: req.body.diferencial4titulo,
                desc: req.body.diferencial4desc,
            };

            return sobre.save();
        })
        .then(() => {
            res.redirect('/admin/sobre')
        })
        .catch(err => next(err, 500));
};