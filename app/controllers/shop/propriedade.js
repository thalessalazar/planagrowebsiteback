const Propiedade = require('../../models/propiedade'),
    Sobre = require('../../models/sobre'),
    getQueryFilter = require('../../util/query-filter');
const Banner = require('../../models/banner');

exports.redefinirSalao = (req, res, next) => {
    Propiedade.find({ tipo: 'Salão Comercial' }).then(props => {
        for (prop of props) {
            prop.tipo = 'Prédio Comercial';
            prop.save();
        }
    }).catch(err => next(err, 500));
}

exports.mostraSalao = (req, res, next) => {
    Propiedade.find({ tipo: 'Prédio Comercial' }).then(props => {
        for (prop of props) {
            console.log(prop.tipo);
        }
    }).catch(err => next(err, 500));
}

exports.mostrarbairro = (req, res, next) => {
    Propiedade.find().distinct('bairro').where('cidade').equals('Bagé').then(bageBairros => {
        console.log(bageBairros);
    });
}

exports.getComprar = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 24;
    let totalItems;

    const query = getQueryFilter(req);
    const sort = {
        vendido: 1,
        date: -1
    }

    if (req.body.genero || req.query.genero) {
        if (!query.$and) {
            query.$and = [];
        }
        query.$and.push({ $or: [{ "genero": req.query.genero || req.body.genero }, { "genero": "Ambos" }] })
    }

    //configurando o ordenador conforme aluguel
    //  1: CRESCENTE -1:DESCRESCENTE - tem que ser refatorado para algo mais simples e dinamico
    if (req.body.genero == 'Aluguel' || req.query.genero == 'Aluguel') {
        if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precoaluguel = 1; }
        if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precoaluguel = -1; }
    }
    if (req.body.genero == 'Venda' || req.query.genero == 'Venda') {
        if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precovenda = 1; }
        if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precovenda = -1; }
    }

    if (req.body.zona == 'Rural' || req.query.zona == 'Rural') {
        if (req.body.genero == 'Aluguel' || req.query.genero == 'Aluguel') {
            if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precoaluguel = 1; }
            if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precoaluguel = -1; }
        }
        if (req.body.genero == 'Venda' || req.query.genero == 'Venda') {
            if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precovenda = 1; }
            if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precovenda = -1; }
        }
        if (req.body.ordenador == 'ec' || req.query.ordenador == 'ec') { sort.extensao = 1 }
        if (req.body.ordenador == 'ed' || req.query.ordenador == 'ed') { sort.extensao = -1 }
        if (req.body.ordenador == 'ac' || req.query.ordenador == 'ac') { sort.acudes = 1 }
        if (req.body.ordenador == 'ad' || req.query.ordenador == 'ad') { sort.acudes = -1 }
        if (req.body.ordenador == 'mc' || req.query.ordenador == 'mc') { sort.mangueiras = 1 }
        if (req.body.ordenador == 'md' || req.query.ordenador == 'md') { sort.mangueiras = -1 }
        if (req.body.ordenador == 'gc' || req.query.ordenador == 'gc') { sort.galpoes = 1 }
        if (req.body.ordenador == 'gd' || req.query.ordenador == 'gd') { sort.galpoes = -1 }
        if (req.body.ordenador == 'sc' || req.query.ordenador == 'sc') { sort.sedes = 1 }
        if (req.body.ordenador == 'sd' || req.query.ordenador == 'sd') { sort.sedes = -1 }
    }

    if (req.body.zona == 'Urbana' || req.query.zona == 'Urbana') {
        if (req.body.genero == 'Aluguel' || req.query.genero == 'Aluguel') {
            if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precoaluguel = 1; }
            if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precoaluguel = -1; }
        }
        if (req.body.genero == 'Venda' || req.query.genero == 'Venda') {
            if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precovenda = 1; }
            if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precovenda = -1; }
        }
        if (req.body.ordenador == 'dc' || req.query.ordenador == 'dc') { sort.dormitorios = 1; }
        if (req.body.ordenador == 'dd' || req.query.ordenador == 'dd') { sort.dormitorios = -1; }
        if (req.body.ordenador == 'sc' || req.query.ordenador == 'sc') { sort.suites = 1; }
        if (req.body.ordenador == 'sd' || req.query.ordenador == 'sd') { sort.suites = -1; }
        if (req.body.ordenador == 'bc' || req.query.ordenador == 'bc') { sort.banheiros = 1; }
        if (req.body.ordenador == 'bd' || req.query.ordenador == 'bd') { sort.banheiros = -1; }
    }

    console.log(query);

    //teste genero da busca para puxar o banner referente aquele genero
    //se não for aluguel ou venda ele busca o banner do genero ambos que já foi presetado
    var generoBanner = 'Ambos';
    if (req.body.genero == 'Aluguel' || req.query.genero == 'Aluguel') { generoBanner = 'Aluguel'; }
    if (req.body.genero == 'Venda' || req.query.genero == 'Venda') { generoBanner = 'Venda'; }
    const filter = {
        referente: 'entre-imoveis',
        genero: generoBanner
    }


    if (sort.precovenda || sort.precoaluguel || sort.dormitorios || sort.suites || sort.banheiros
        || sort.extensao || sort.acudes || sort.mangueiras || sort.galpoes || sort.sedes) {
        delete sort.date;
    }

    Propiedade.find({ ...query, ativo: true })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Propiedade.find({ ...query, ativo: true })
                .sort(sort)
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(props => {

                    if (!req.query || !req.body) {
                        props = props.sort((x, y) => {
                            return (x.destaque === y.destaque) ? 0 : x ? -1 : 1
                        })
                    }

                    Sobre.findOne()
                        .then(sobre => {
                            Banner.find({ referente: 'propriedade-banner' }).then(banner => {
                                Banner.find(filter).then(bannerimoveis => {
                                    if (req.query == {} || req.body == {}) {
                                        let prop = pclearps.sort()
                                    }

                                    Banner.find({ referente: 'filtro-banner' }).then(bannerFiltro => {
                                        Propiedade.find().distinct('bairro').where('cidade').equals('Bagé').then(bairroBage => {
                                            res.render('shop/comprar', {
                                                pageTitle: "Comprar, alugar ou arrendar propiedades rurais ou urbanas",
                                                props: props,
                                                path: "/comprar",
                                                hasNext: currentPage < totalPages,
                                                hasPrevious: currentPage > 1,
                                                totalPages,
                                                currentPage,
                                                robotsFollow: true,
                                                sobre: sobre,
                                                banner: banner,
                                                bannerimoveis: bannerimoveis,
                                                bairroBage: bairroBage,
                                                bannerFiltro: bannerFiltro,
                                                contact: true,
                                                form: req.query,
                                                genero: req.body.genero || req.query.genero
                                            });
                                        })
                                            .catch(err => next(err, 500));
                                    })
                                        .catch(err => next(err, 500));
                                })
                                    .catch(err => next(err, 500));
                            })
                                .catch(err => next(err, 500));
                        })
                        .catch(err => next(err, 500));
                })
                .catch(err => next(err, 500));
        });
}
// <% for (bairro of bairroBage) { %>
//     <option disabled class="bairro-bage" value="<%=bairro%>"><%=bairro%></option>
// <% } %>
exports.getPropiedade = (req, res, next) => {
    const propCod = req.params.propCod;
    Propiedade.findOne({
        codigo: propCod
    })
        .then(prop => {
            console.log(prop);
            if (!prop) {
                return res.redirect('/comprar');
            }

            if ((!prop.ativo || prop.vendido) && !req.session.user) {
                return res.redirect('/comprar');
            }

            Sobre.findOne()
                .then(sobre => {
                    Banner.find({ referente: 'compra-banner' }).then(banner => {
                        return res.render('shop/propriedade', {
                            pageTitle: prop.youtube_id,
                            prop: prop,
                            mapURI: `Rua ${prop.rua}, numero ${prop.numero}. Bairro${prop.bairro}. CEP: ${prop.cep}`,
                            path: "/propiedade",
                            robotsFollow: true,
                            sobre: sobre,
                            contact: true,
                            errorMessage: [],
                            banner: banner,
                            form: false,
                            successMessage: false,
                            csrfToken: req.csrfToken(),
                        });
                    })
                        .catch(err => next(err, 500))
                })
                .catch(err => next(err, 500))
        })
        .catch(err => next(err, 505));
}