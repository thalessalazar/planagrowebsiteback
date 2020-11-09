const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAutoIncrement = require('mongoose-auto-increment');
const mongoURI = require('../util/mongo_URI');
const connection = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

const Propiedade = new Schema({

    titulo: {
        type: String,
        required: true,
    },

    proprietarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },

    propietario: {
        type: String,
        required: false,
    },

    vendido: {
        type: Boolean,
        required: true,
        default: false,
    },

    alugado: {
        type: Boolean,
        required: true,
        default: false,
    },

    descricao: {
        type: String,
        required: false,
    },

    observacoesadmin: {
        type: String,
        required: false,
    },

  
    taxas: {
        type: Boolean,
        default: false,
        required: false,
    },

    // rural/urbana
    zona: {
        type: String,
        required: true,
    },

    tipo: {
        type: String,
        required: true
    },

    genero: {
        type: String,
        required: true,
    },

    preco: {
        type: Number,
        default: 0,
        required: false,
    },

    precovenda: {
        type: Number,
        default: 0,
        required: false,
    },

    precoaluguel: {
        type: Number,
        default: 0,
        required: false,
    },

    precoHec: {
        type: Number,
        default: 0,
        required: false,
    },

    ativo: {
        type: Boolean,
        default: true,
        required: true,
    },

    // ativovenda: {
    //     type: Boolean,
    //     default: true,
    //     required: true,
    // },

    // ativoaluguel: {
    //     type: Boolean,
    //     default: true,
    //     required: true,
    // },

    destaque: {
        type: Boolean,
        required: true,
    },

    mainImage: {
        type: Object,
    },

    images: {
        type: Array,
        required: false
    },

    vantagens: {
        type: Array
    },

    cidade: {
        type: String,
        required: false,
    },

    municipio: {
        type: String,
        required: false,
    },

    //Zona Rural
    extensao: {
        type: Number,
        required: false,
    },

    localidade: {
        type: String,
        required: false,
    },

    acudes: {
        type: Number,
        required: false,
    },

    barragens: {
        type: Number,
        required: false,
    },

    mangueiras: {
        type: Number,
        required: false,
    },

    galpoes: {
        type: Number,
        required: false,
    },

    sedes: {
        type: Number,
        required: false,
    },

    //Zona Urbana
    area: {
        type: Number,
        required: false,
    },

    cep: {
        type: String,
        required: false,
    },

    bairro: {
        type: String,
        required: false,
    },

    rua: {
        type: String,
        required: false,
    },

    numero: {
        type: String,
        required: false,
    },

    cidade: {
        type: String,
        required: false,
    },


    dormitorios: {
        type: Number,
        required: false,
    },

    banheiros: {
        type: Number,
        required: false,
    },

    salas: {
        type: Number,
        required: false,
    },

    suites: {
        type: Number,
        required: false,
    },

    cozinhas: {
        type: Number,
        required: false,
    },

    patio: {
        type: Boolean,
        required: false,
    },

    piscina: {
        type: Boolean,
        required: false,
    },

    mobiliado: {
        type: Boolean,
        required: false,
    },

    codigo: {
        type: Number
    },

    date: {
        type: Date,
        default: Date.now(),
        required: false
    },
    youtube_id:{
        type: String        
    },
      //observacao rapida para facilidar visualização
    // de alguma obs na listagem de propriedade
    obsrapidas: {
        type: String,
        required: false
    }
});

mongooseAutoIncrement.initialize(connection, {
    useNewUrlParser: true
});

Propiedade.plugin(mongooseAutoIncrement.plugin, {
    model: 'Propiedade',
    field: 'codigo',
    startAt: 100,
    incrementBy: 4
});

module.exports = mongoose.model('Propiedade', Propiedade);