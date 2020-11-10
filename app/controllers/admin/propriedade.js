const Propiedade = require('../../models/propiedade'),
    Cliente = require('../../models/cliente'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary'),
    queryFilter = require('../../util/query-filter'),
    json2xls = require('json2xls'),
    excel = require('node-excel-export');
const youtube = require('../../util/id_youtube');

//PROPIEDADES
exports.getPropiedades = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = {};

    if (req.query.titulo && req.query.titulo != '') {
        query.titulo = {
            $regex: req.query.titulo,
            $options: 'i'
        }
    }

    if (req.query.codigo && req.query.codigo != '') {
        query.codigo = req.query.codigo;
    }

    if (req.query.destaque && req.query.destaque != '') {
        query.destaque = req.query.destaque;
    }

    if (req.query.ativo && req.query.ativo != '') {
        query.ativo = req.query.ativo;
    }
    if (req.query.proprietarioId && req.query.proprietarioId != '') {
        query.proprietarioId = req.query.proprietarioId;
    }

    Propiedade.find({
        ...query
    })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Propiedade.find(query)
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .sort({
                    $natural: -1,
                    ativo: 1,
                    vendido: 1,
                })
                .populate('proprietarioId')
                .then(props => {
                    res.render('admin/propriedade/propriedades', {
                        pageTitle: "Gerenciar Propriedades",
                        props: props,
                        path: "admin/propiedades",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage,
                        robotsFollow: false,
                        contact: false,
                        form: req.query
                    });
                })
                .catch(err => next(err, 500));
        })
};


//GET NEW PROPIEDADE
exports.getNewPropiedade = (req, res, next) => {
    Cliente.find()
        .select('codigo nome')
        .then(clientes => {
            res.render('admin/propriedade/novapropriedade', {
                pageTitle: "Nova Propiedade",
                path: "admin/novapropiedade",
                errorMessage: [],
                form: false,
                clientes,
                robotsFollow: false,
                contact: false
            });
        })
        .catch(err => next(err, 500))
};
 
//POST NEW PROPIEDADE
exports.postNewPropiedade = (req, res, next) => {
    req.body.ativo = req.body.ativo == 'on' ? 'true' : 'false';

    req.body.vendido = req.body.vendido == 'on' ? 'true' : 'false';
    req.body.alugado = req.body.alugado == 'on' ? 'true' : 'false';
   
    req.body.destaque = req.body.destaque == 'on' ? 'true' : 'false';
    req.body.taxas = req.body.taxas == 'on' ? 'true' : 'false';

    req.body.piscina = req.body.piscina == 'on' ? 'true' : 'false';
    req.body.patio = req.body.patio == 'on' ? 'true' : 'false';
    req.body.mobiliado = req.body.mobiliado == 'on' ? 'true' : 'false';

    req.body.vantagens = req.body.vantagens ? JSON.parse(req.body.vantagens) : [];

    const link_youtube = req.body.youtube_id;

    req.body.youtube_id = youtube.extractIdYoutubeVideo(link_youtube);

    console.log(req.body.observacoesrapidas);

    const form = {
        ...req.body
    }

    if (req.body.proprietarioId == '') {
        delete form.proprietarioId;
    }

    if (req.file) {
        fileHelper.compressImage(req.file, 700)
            .then(newPath => {
                cloudinary.uploader.upload(newPath, {
                    folder: 'planagro'
                })
                    .then(image => {
                        fileHelper.delete(newPath);

                        new Propiedade({
                            ...form,
                            mainImage: image,

                        })
                            .save()
                            .then(prop => {
                                if (req.body.novoCliente && req.body.novoCliente != '' && !req.body.proprietarioId) {
                                    new Cliente({
                                        nome: req.body.novoCliente
                                    })
                                        .save()
                                        .then(cliente => {
                                            prop.proprietarioId = cliente._id;
                                            prop.save();
                                        })
                                        .catch(err => console.log(err))
                                }

                                return prop;
                            })
                            .then(prop => {
                                res.redirect('/admin/propiedades/outrasfotos/' + prop.codigo);
                            })

                            .catch(err => next(err));
                    })
                    
            })

    } else {
        new Propiedade({
            ...form
        })
            .save()
            .then(prop => {
                if (req.body.novoCliente && req.body.novoCliente != '' && !req.body.proprietarioId) {
                    new Cliente({
                        nome: req.body.novoCliente
                    })
                        .save()
                        .then(cliente => {
                            prop.proprietarioId = cliente._id;
                            prop.save();
                        })
                        .catch(err => console.log(err))

                }
                return prop;
            })
            .then(prop => {
                res.redirect('/admin/propiedades/outrasfotos/' + prop.codigo);
            })

            .catch(err => next(err));
    }
};

exports.setPropiedadeImage = (req, res, next) => {
    const propId = req.body.id;

    Propiedade.findOne({
        _id: propId,
    })
        .then(prop => {
            if (!prop) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor e a propiedade não foi encontrada.",
                });
            }

            fileHelper.compressImage(req.file, 700)
                .then(newPath => {

                    cloudinary.uploader.upload(newPath, {
                        folder: 'planagro'
                    })

                        .then(image => {
                            fileHelper.delete(newPath);
                            prop.images.push(image);
                            prop.save()
                                .then(resul => {
                                    return res.status(200).json(JSON.stringify(image));
                                })
                                .catch(err => {
                                    cloudinary.uploader.destroy(image.public_id)
                                    res.status(500).json({
                                        "message": err
                                    });
                                });
                        })
                        .catch(err => res.status(500).json({
                            "message": err
                        }))

                })
                .catch(err => res.status(500).json({
                    "message": err
                }))

        })
        .catch(err => res.status(500).json({
            "message": err
        }))
}

exports.removePropiedadeImage = (req, res, next) => {
    const propId = req.body.propId;
    const imageId = req.body.imageId;

    Propiedade.findOne({
        _id: propId,
    })

        .then(prop => {
            if (!prop) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor e a propiedade não foi encontrada.",
                });
            }

            const oldImages = prop.images;

            prop.images = oldImages.filter(image => image.public_id != imageId);

            prop.save()
                .then(resul => {
                    cloudinary.uploader.destroy(imageId)
                        .then(resul => {
                            return res.status(200).json({
                                success: true
                            });
                        })
                        .catch(err => {
                            cloudinary.uploader.destroy(image.public_id)
                            res.status(500).json({
                                'message': "Falha na hora de apagar a imagem do servidor"
                            });
                        });
                })
                .catch(err => res.status(500).json({
                    'message': "Falha na hora de salvar as alterações" + err
                }))

        })
        .catch(err => res.status(500).json({
            'message': "Falha na hora de buscar no BD" + err
        }))
}

//GET EDIT PROPIEDADE
exports.getEditPropiedade = (req, res, next) => {
    const propId = req.params.propId;

    Propiedade.findOne({
        _id: propId
    })
        .populate('proprietarioId')
        .then(prop => {
            console.log(prop.finalidade);
            if (!prop) {
                return res.redirect('/admin/propiedades')
            }
            console.log(prop.obsrapidas)
            Cliente.find()
                .select('codigo nome')
                .then(clientes => {
                    res.render('admin/propriedade/editarpropriedade', {
                        pageTitle: "Editar Propiedade",
                        path: "admin/propiedades",
                        prop: prop,
                        clientes: clientes,
                        errorMessage: [],
                        form: false,
                        robotsFollow: false,
                        contact: false
                    })
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
};

//GET EDIT PROPIEDADE
exports.getOutrasFotos = (req, res, next) => {
    const propCod = req.params.propCod;

    Propiedade.findOne({
        codigo: propCod
    })
        .then(prop => {
            if (!prop) {
                return res.redirect('/admin/propiedades')
            }
            res.render('admin/propriedade/outrasfotos', {
                pageTitle: "Editar Outra fotos",
                path: "admin/propiedades",
                prop: prop,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT PROPIEDADE
exports.postEditPropiedade = (req, res, next) => {
    console.log(req.body.finalidade);
    req.body.ativo = req.body.ativo == 'on' ? 'true' : 'false';
    // req.body.ativovenda = req.body.ativovenda == 'on' ? 'true' : 'false';
    // req.body.ativoaluguel = req.body.ativoaluguel == 'on' ? 'true' : 'false';
    req.body.vendido = req.body.vendido == 'on' ? 'true' : 'false';
    req.body.alugado = req.body.alugado == 'on' ? 'true' : 'false';

    req.body.destaque = req.body.destaque == 'on' ? 'true' : 'false';
    req.body.taxas = req.body.taxas == 'on' ? 'true' : 'false';

    req.body.piscina = req.body.piscina == 'on' ? 'true' : 'false';
    req.body.patio = req.body.patio == 'on' ? 'true' : 'false';
    req.body.mobiliado = req.body.mobiliado == 'on' ? 'true' : 'false';

    const link_youtube = req.body.youtube_id;
    req.body.youtube_id = youtube.extractIdYoutubeVideo(link_youtube);

    Propiedade.findOne({
        _id: req.body.id
    })
        .then(prop => {

            if (!prop) {
                return next(new Error('Houve um erro e a sua propiedade não foi encontrada, volte e tente novamente.'));
            }

            prop.obsrapidas = req.body.obsrapidas
            prop.alugado = req.body.alugado;
            prop.finalidade = req.body.finalidade;

            if (req.file) {
                if (prop.mainImage) {
                    cloudinary.uploader.destroy(prop.mainImage.public_id)
                }

                fileHelper.compressImage(req.file, 700)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath, {
                            folder: 'planagro'
                        })
                            .then(image => {

                                fileHelper.delete(newPath);

                                prop.mainImage = image;
                                prop.date = Date.now();
                                prop.ativo = req.body.ativo;
                                // prop.ativoaluguel = req.body.ativoaluguel;
                                // prop.ativovenda = req.body.ativovenda;
                                prop.vendido = req.body.vendido;
                                prop.alugado = req.body.alugado;
                             
                                prop.destaque = req.body.destaque;
                                prop.titulo = req.body.titulo;
                                prop.descricao = req.body.descricao;
                                prop.observacoesadmin = req.body.observacoesadmin;
                                prop.zona = req.body.zona;
                                prop.precovenda = req.body.precovenda;
                                prop.taxas = req.body.taxas;
                                prop.precoaluguel = req.body.precoaluguel;
                                prop.precoHec = req.body.precoHec;
                                prop.tipo = req.body.tipo;
                                prop.genero = req.body.genero;
                                prop.extensao = req.body.extensao;
                                prop.area = req.body.area;
                                prop.municipio = req.body.municipio;

                                if (prop.municipio === 'Bagé') {
                                    prop.localidade = req.body.localidade;
                                } else {
                                    prop.localidade = '';
                                }
                                prop.cep = req.body.cep;
                                prop.bairro = req.body.bairro;
                                prop.rua = req.body.rua;
                                prop.numero = req.body.numero;
                                prop.vantagens = JSON.parse(req.body.vantagens);

                                if (req.body.proprietarioId && req.body.proprietarioId != '') {
                                    prop.proprietarioId = req.body.proprietarioId;
                                }

                                //detalhes urbano
                                prop.dormitorios = req.body.dormitorios;
                                prop.salas = req.body.salas;
                                prop.suites = req.body.suites;
                                prop.cozihas = req.body.cozihas;
                                prop.banheiros = req.body.banheiros;
                                prop.piscina = req.body.piscina;
                                prop.imobiliado = req.body.imobiliado;
                                prop.patio = req.body.patio;

                                //detalhes rural
                                prop.mangueiras = req.body.mangueiras;
                                prop.galpoes = req.body.galpoes;
                                prop.sedes = req.body.sedes;
                                prop.barragens = req.body.barragens;
                                prop.acudes = req.body.acudes;

                                prop.youtube_id = req.body.youtube_id;

                                prop.save();
                                return res.redirect('/admin/propiedades');

                            })
                            .catch(err => next(err))
                    })
                    .catch(err => next(err));
            } else {

                prop.ativo = req.body.ativo;
                prop.date = Date.now();
                // prop.ativoaluguel = req.body.ativoaluguel;
                // prop.ativovenda = req.body.ativovenda;
                prop.vendido = req.body.vendido;
                prop.destaque = req.body.destaque;
                prop.titulo = req.body.titulo;

                if (req.body.proprietarioId && req.body.proprietarioId != '') {
                    prop.proprietarioId = req.body.proprietarioId;
                }

                prop.descricao = req.body.descricao;
                prop.observacoesadmin = req.body.observacoesadmin;
                prop.zona = req.body.zona;
                prop.precovenda = req.body.precovenda;
                prop.taxas = req.body.taxas;
                prop.precoaluguel = req.body.precoaluguel;
                prop.tipo = req.body.tipo;
                prop.genero = req.body.genero;
                prop.extensao = req.body.extensao;
                prop.area = req.body.area;
                prop.precoHec = req.body.precoHec;
                prop.municipio = req.body.municipio;
                if (prop.municipio === 'Bagé') {
                    prop.localidade = req.body.localidade;
                } else {
                    prop.localidade = '';
                }
                prop.cep = req.body.cep;
                prop.bairro = req.body.bairro;
                prop.rua = req.body.rua;
                prop.numero = req.body.numero;
                prop.vantagens = JSON.parse(req.body.vantagens);

                //detalhes urbano
                prop.dormitorios = req.body.dormitorios;
                prop.salas = req.body.salas;
                prop.suites = req.body.suites;
                prop.cozihas = req.body.cozihas;
                prop.banheiros = req.body.banheiros;
                prop.piscina = req.body.piscina;
                prop.imobiliado = req.body.imobiliado;
                prop.patio = req.body.patio;

                prop.youtube_id = req.body.youtube_id;

                //detalhes rural
                prop.mangueiras = req.body.mangueiras;
                prop.galpoes = req.body.galpoes;
                prop.sedes = req.body.sedes;
                prop.barragens = req.body.barragens;
                prop.acudes = req.body.acudes;
                prop.save();
                return res.redirect('/admin/propiedades')
            }
        })
        .catch(err => next(err));
}

//DELETE PROPIEDADE
exports.deletePropiedade = (req, res, next) => {
    const id = req.body.id;

    Propiedade.findOneAndDelete({
        _id: id
    })

        .then(prop => {
            if (!prop) {
                res.redirect('/admin/propiedades')
            }

            if (prop.mainImage) {
                cloudinary.uploader.destroy(prop.mainImage.public_id);
            }

            let destroyPromise = [];
            if (prop.images.length > 0) {
                destroyPromise = prop.images.map(img => cloudinary.uploader.destroy(img.public_id))
            }

            Promise.all(destroyPromise);

            res.redirect('/admin/propiedades')
        })

        .catch(err => next(err));
};

exports.getTabela = (req, res, next) => {
    res.render('admin/propriedade/gerartabela', {
        pageTitle: "Gerar tabela",
        path: "admin/gerartabela",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
}

exports.postTabela = (req, res, next) => {
    const query = queryFilter({
        query: req.body
    });

    Propiedade.find({
        ...query
    })
        .populate('proprietarioId')
        .then(props => {
            const prepareData = props.map(prop => {
                const data = {
                    codigo: prop.codigo,
                    titulo: prop.titulo,
                    tipo: prop.tipo,
                    genero: prop.genero,
                    precovenda: prop.zona == 'Urbana' ? prop.precovenda : prop.precoHec,
                    precoaluguel: prop.precoaluguel,
                    cidade: prop.zona == 'Urbana' ? prop.cidade : prop.municipio,
                    rua: prop.rua,
                    bairro: prop.bairro,
                    numero: prop.numero,
                    cep: prop.cep,
                    area: prop.area,
                    extensao: prop.extensao,
                    dormitorios: prop.dormitorios,
                    suites: prop.suites,
                    salas: prop.salas,
                    cozinhas: prop.cozinhas,
                    banheiros: prop.banheiros,
                    proprietario: prop.proprietarioId ? prop.proprietarioId.nome : ''
                }
                return data;
            });

            Promise.all(prepareData)
                .then(data => {
                    // var xls = json2xls(json);
                    // const randomNumber = Math.random();
                    // fs.writeFileSync('app/public/tempimages/table'+randomNumber+'.xls', xls, 'binary');
                    var styles = {
                        header: {
                            fill: {
                                fgColor: {
                                    rgb: '601416'
                                }
                            },
                            font: {
                                color: {
                                    rgb: 'FFFFFFFF',
                                },
                                sz: 14
                            }
                        },
                    };

                    var specification = {
                        codigo: {
                            "displayName": 'Código',
                            "headerStyle": styles.header,
                            "cellStyle": styles.header,
                            "width": 80
                        },

                        titulo: {
                            "displayName": 'Título',
                            "headerStyle": styles.header,
                            "width": 270
                        },

                        tipo: {
                            displayName: 'Tipo',
                            headerStyle: styles.header,
                            width: 110
                        },

                        genero: {
                            displayName: 'Gênero',
                            headerStyle: styles.header,
                            width: 80
                        },

                        precovenda: {
                            displayName: 'Preço Venda',
                            headerStyle: styles.header,
                            width: 120
                        },

                        precoaluguel: {
                            displayName: 'Preco Aluguel',
                            headerStyle: styles.header,
                            width: 120
                        },

                        cidade: {
                            displayName: 'Cidade',
                            headerStyle: styles.header,
                            width: 80
                        },

                        rua: {
                            displayName: 'Rua',
                            headerStyle: styles.header,
                            width: 200
                        },

                        bairro: {
                            displayName: 'Bairro',
                            headerStyle: styles.header,
                            width: 150
                        },

                        numero: {
                            displayName: 'Número',
                            headerStyle: styles.header,
                            width: 100
                        },

                        cep: {
                            displayName: 'CEP',
                            headerStyle: styles.header,
                            width: 100
                        },

                        area: {
                            displayName: 'Área',
                            headerStyle: styles.header,
                            width: 70
                        },


                        extensao: {
                            displayName: 'Extensão',
                            headerStyle: styles.header,
                            width: 70
                        },


                        dormitorios: {
                            displayName: 'Quartos',
                            headerStyle: styles.header,
                            width: 60
                        },


                        suites: {
                            displayName: 'Suítes',
                            headerStyle: styles.header,
                            width: 60
                        },


                        salas: {
                            displayName: 'Salas',
                            headerStyle: styles.header,
                            width: 60
                        },


                        cozinhas: {
                            displayName: 'Cozinhas',
                            headerStyle: styles.header,
                            width: 60
                        },

                        banheiros: {
                            displayName: 'Banheiros',
                            headerStyle: styles.header,
                            width: 80
                        },

                        proprietario: {
                            "displayName": 'Proprietário',
                            "headerStyle": styles.header,
                            "width": 215
                        },
                    }

                    const xls = excel.buildExport(
                        [{
                            name: 'Tabela_Propriedades.xlsx',
                            data,
                            specification
                        }]
                    );
                    res.setHeader('Content-disposition', 'attachment; filename=Tabela_Propriedades.xlsx');
                    res.send(xls);
                })
                .catch(err => next(err, 500))
        })
        .catch(err => next(err, 500));
}