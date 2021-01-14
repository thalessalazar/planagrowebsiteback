const Banner = require('../../models/banner');
const fileHelper = require('../../util/file-helper');
const cloudinary = require('../../util/cloudinary');

exports.getBanner = (req, res, next) => {
    Banner.find().then(banners => {
        res.render('admin/banner/banner', {
            pageTitle: "Banners do Site",
            path: "admin/banner",
            errorMessage: [],
            banners: banners,
            form: false,
            robotsFollow: false,
            contact: false
        });
    })
};

exports.postNewBanner = async (req, res, next) => {
    const { titulo, descricao, textobotao, linkbotao, referente } = req.body;
    const fixed = req.body.fixed == 'on' ? 'true' : 'false';
    if (req.file) {
        fileHelper.compressImage(req.file).then(newPath => {
            cloudinary.uploader.upload(newPath, { folder: 'planagro' }).then(result => {
                fileHelper.delete(newPath);
                new Banner({
                    titulo,
                    descricao,
                    textobotao,
                    linkbotao,
                    fixed,
                    referente,
                    image: result
                }).save().then(() => {
                    res.redirect('/admin');
                }).catch(err => {
                    console.log(err);
                    res.render('admin/banner/novoBanner', {
                        pageTitle: "Novo Banner",
                        path: "admin/banner",
                        errorMessage: ["Houve algum erro ao cadastrar o banner"],
                        robotsFollow: false,
                        contact: false
                    });
                });
            }).catch(err => next(err));
        }).catch(err => next(err));
    } else {
        //define form para poder colocar nos value para o 
        //usuario não perder o que já foi colocado input
        const form = { titulo, descricao, textobotao, linkbotao, fixed };
        res.render('admin/banner/novoBanner', {
            pageTitle: "Novo Banner",
            path: "admin/banner",
            form: form,
            errorMessage: ["Insira alguma imagem"],
            robotsFollow: false,
            contact: false
        });
    }
};

exports.getNewBanner = (req, res, next) => {
    res.render('admin/banner/novoBanner', {
        pageTitle: "Novo Banner",
        path: "admin/banner",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};

exports.getEditBanner = (req, res, next) => {
    const id = req.params.id;
    Banner.findById({ _id: id }).then(banner => {
        res.status(200).render('admin/banner/editBanner', {
            pageTitle: "Edição de Banner",
            path: "admin/banner",
            robotsFollow: false,
            banner: banner,
            errorMessage: [],
            contact: false
        });
    });
};

exports.postEditBanner = (req, res, next) => {
    const id = req.body.id;
    const fixed = req.body.fixed == 'on' ? 'true' : 'false';
    const { titulo, descricao, linkbotao, textobotao, referente, genero } = req.body;

    Banner.findOne({ _id: id }).then(banner => {
        console.log(banner)
        if (req.file) {
            console.log(req.file);
            fileHelper.compressImage(req.file).then(newPath => {
                cloudinary.uploader.upload(newPath, { folder: 'planagro' }).then(result => {
                    fileHelper.delete(newPath);
                    banner.image = result;
                    banner.fixed = fixed;
                    banner.titulo = titulo;
                    banner.descricao = descricao;
                    banner.linkbotao = linkbotao;
                    banner.textobotao = textobotao;
                    banner.referente = referente;
                    banner.genero = genero;
                    banner.save();
                    return res.redirect('/admin/banner');
                }).catch(err => next(err));
            }).catch(err => next(err));
        } else {
            banner.fixed = fixed;
            banner.titulo = titulo;
            banner.descricao = descricao;
            banner.linkbotao = linkbotao;
            banner.textobotao = textobotao;
            banner.referente = referente;
            banner.genero = genero;
            banner.save();
            return res.redirect('/admin/banner');
        }
    }).catch(err => next(err));
}

exports.postRedefineDefault = (req, res, next) => {
    const referente = req.body.referente;
    const genero = req.body.genero;

    var bannerdefault = {};

    if (referente == 'entre-imoveis') {
        if (genero == 'Aluguel') {
            //aluguel
            bannerdefault = {
                fixed: false,
                titulo: '',
                descricao: '',
                textobotao: '',
                linkbotao: '',
                image: {
                    asset_id: "04e32647fd3cae26142904e9437c65b8",
                    public_id: "aqichfa5twtf6orkd6su",
                    version: 1606617774,
                    version_id: "baece09aac70fcf2bcf150760a485d7f",
                    signature: "5316c9b95b352f9ad5a43e8f3013831589adaf55",
                    width: 5376,
                    height: 1251,
                    format: "jpg",
                    resource_type: "image",
                    created_at: "2020-11-29T02:42:54Z",
                    tags: [],
                    bytes: 291877,
                    type: "upload",
                    etag: "509402195e4ed840bb0ce332c8fc3999",
                    placeholder: false,
                    url: "http://res.cloudinary.com/dhenuhnbj/image/upload/v1606617774/aqichfa5twtf6orkd6su.jpg",
                    secure_url: "https://res.cloudinary.com/dhenuhnbj/image/upload/v1606617774/aqichfa5twtf6orkd6su.jpg",
                    access_mode: "public",
                    original_filename: "1606617771696-banner-entreimoveis-alugar",
                    original_extension: "jpeg"
                }
            }
        } else if (genero == 'Ambos') {
            bannerdefault = {
                fixed: false,
                titulo: '',
                descricao: '',
                textobotao: '',
                linkbotao: '',
                image: {
                    asset_id: "419f103d898f1eb36bc7916f0eada5bf",
                    public_id: "k0vwyzmtwtxzsoy6xs6t",
                    version: 1606617827,
                    version_id: "00dcb3e6a521df7a4c807d42909d61f8",
                    signature: "850082f765a6a507f9b4f4589b3f86ab2e009976",
                    width: 5376,
                    height: 1251,
                    format: "jpg",
                    resource_type: "image",
                    created_at: "2020-11-29T02:43:47Z",
                    tags: [],
                    bytes: 189124,
                    type: "upload",
                    etag: "97bc6551ec7d744af84614d023ed2744",
                    placeholder: false,
                    url: "http://res.cloudinary.com/dhenuhnbj/image/upload/v1606617827/k0vwyzmtwtxzsoy6xs6t.jpg",
                    secure_url: "https://res.cloudinary.com/dhenuhnbj/image/upload/v1606617827/k0vwyzmtwtxzsoy6xs6t.jpg",
                    access_mode: "public",
                    original_filename: "1606617824408-banner-entreimoveis-ambos",
                    original_extension: "jpeg"
                }
            }
        } else {
            bannerdefault = {
                fixed: false,
                titulo: '',
                descricao: '',
                textobotao: '',
                linkbotao: '',
                image: {
                    asset_id: "fe4f700664f1718c8fd5e9c7fc9383ec",
                    public_id: "xwsqvdubqzwvvl9pg5f2",
                    version: 1606617715,
                    version_id: "ffb746a738bff23e90874d250bdfc13d",
                    signature: "4a84896ab78da5140c1b6b7d27395bf1a58e9ab6",
                    width: 5376,
                    height: 1251,
                    format: "jpg",
                    resource_type: "image",
                    created_at: "2020-11-29T02:41:55Z",
                    tags: [],
                    bytes: 421517,
                    type: "upload",
                    etag: "1521f974cfb5b164a4de170e51fb95fe",
                    placeholder: false,
                    url: "http://res.cloudinary.com/dhenuhnbj/image/upload/v1606617715/xwsqvdubqzwvvl9pg5f2.jpg",
                    secure_url: "https://res.cloudinary.com/dhenuhnbj/image/upload/v1606617715/xwsqvdubqzwvvl9pg5f2.jpg",
                    access_mode: "public",
                    original_filename: "1606617711834-banner-entreimoveis-venda",
                    original_extension: "jpeg"
                }
            }
        }

    } else if (referente == 'home-filtro') {

        bannerdefault = {
            fixed: true,
            titulo: '',
            descricao: '',
            textobotao: '',
            linkbotao: '',
            image: {
                asset_id: "6038aeef67925ab6a90cba8eece2bcfd",
                public_id: "otk4vk3codqf1wzzjltt",
                version: 1606498318,
                version_id: "d566b4e4c6cd6224e5f80594ecb72247",
                signature: "2982a2418add07e360510e8be17759d56b604bfc",
                width: 2052,
                height: 1080,
                format: "jpg",
                resource_type: "image",
                created_at: "2020-11-27T17:31:58Z",
                tags: [],
                bytes: 199186,
                type: "upload",
                etag: "14bae1aadcfe397fb6054bfa7e344d64",
                placeholder: false,
                url: "http://res.cloudinary.com/dhenuhnbj/image/upload/v1606498318/otk4vk3codqf1wzzjltt.jpg",
                secure_url: "https://res.cloudinary.com/dhenuhnbj/image/upload/v1606498318/otk4vk3codqf1wzzjltt.jpg",
                access_mode: "public",
                original_filename: "1606498315903-fixed-slider",
                original_extension: "jpeg"
            }
        }
    }
    else if (referente == 'filtro-banner') {

        bannerdefault = {
            fixed: true,
            titulo: '',
            descricao: '',
            textobotao: '',
            linkbotao: '',
            image: {
                asset_id: "7a4214eea75dcb4f9585a140cccdf0ba",
                public_id: "fbfh9sin9q8d1ya4q1la",
                version: 1610632635,
                version_id: "cc3b09658e390fbfb102dbe2c85afc60",
                signature: "eec88740f57a9d9e49b31819cfe7ced3197461ae",
                width: 1920,
                height: 280,
                format: "jpg",
                resource_type: "image",
                created_at: "2021-01-14T13:57:15Z",
                tags: [],
                bytes: 105790,
                type: "upload",
                etag: "4d62139df8afc3ed804a1931de5a47d4",
                placeholder: false,
                url: "http://res.cloudinary.com/dhenuhnbj/image/upload/v1610632635/fbfh9sin9q8d1ya4q1la.jpg",
                secure_url: "https://res.cloudinary.com/dhenuhnbj/image/upload/v1610632635/fbfh9sin9q8d1ya4q1la.jpg",
                access_mode: "public",
                original_filename: "1610632633386-banner-filtros",
                original_extension: "jpeg"
            },
        }

    } else {
        bannerdefault = {
            fixed: true,
            titulo: 'Quer vender seu imóvel?',
            descricao: '',
            textobotao: 'ENTRE EM CONTATO',
            linkbotao: '/contato',
            image: {
                asset_id: "29c99fee070eedc3568f94739eddf0db",
                public_id: "zhmoo1l5lsrkzekyy4cn",
                version: 1602179855,
                version_id: "51090030b34ea0873c53f48e55b58da3",
                signature: "a0b345417d3ff05c2a2479dd077ba03ed9a167d7",
                width: 1920,
                height: 940,
                format: "jpg",
                resource_type: "image",
                created_at: "2020-10-08T17:57:35Z",
                tags: [],
                bytes: 176599,
                type: "upload",
                etag: "5a84dcd2eef1b28130273550ce5a47b2",
                placeholder: false,
                url: "http://res.cloudinary.com/dhenuhnbj/image/upload/v1602179855/zhmoo1l5lsrkzekyy4cn.jpg",
                secure_url: "https://res.cloudinary.com/dhenuhnbj/image/upload/v1602179855/zhmoo1l5lsrkzekyy4cn.jpg",
                access_mode: "public",
                original_filename: "1602179852170-banner1920x1170",
                original_extension: "jpeg"
            }

        };

        Banner.findOne({ referente: referente }).then(banner => {
            banner.titulo = bannerdefault.titulo;
            banner.descricao = bannerdefault.descricao;
            banner.textobotao = bannerdefault.textobotao;
            banner.linkbotao = bannerdefault.linkbotao;
            banner.fixed = bannerdefault.fixed;
            banner.image = bannerdefault.image;

            console.log(banner)

            banner.save().then(() => {
                return res.redirect('/admin/banner');
            }).catch(err => next(err));

        }).catch(err => next(err));
    }

};