const Propiedade = require('../../models/propiedade'),
    Sobre = require('../../models/sobre'),
    Depoimento = require('../../models/depoimento');
const Banner = require('../../models/banner');

exports.getIndex = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            Propiedade.find({
                destaque: true,
                ativo: true
            })
                .sort({ vendido: 1, alugado: 1 ,date: -1 })
                .then(props => {
                    Propiedade.find().distinct('bairro').where('cidade').equals('Bagé').then(bairroBage => {
                        Depoimento.find()
                        .then(deps => {
                            Banner.find({ referente: 'home' }).then(banner => {
                                Banner.find({referente: 'home-filtro'}).then(bannerFiltro => {


                                    // return res.json(props);

                                    res.render('shop/home', {
                                        pageTitle: "Início",
                                        path: "/",
                                        props: props,
                                        sobre: sobre,
                                        deps: deps,
                                        robotsFollow: true,
                                        contact: true,
                                        genero: 'Ambos',
                                        bairroBage: bairroBage,
                                        banner: banner,
                                        bannerFiltro: bannerFiltro,
                                        csrfToken: req.csrfToken()
                                    });
                                })
                                    .catch(err => next(err));
                            })
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                    })
                    .catch(err => next(err));
                })
                .catch(err => next(err));
        })
        .catch(err => next(err))
}