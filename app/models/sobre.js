const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sobre = new Schema({
    
    endereco: {
        type: String,
        required: false
    },
    
    
    telefone: {
        type: String,
        required: false
    },
    
    whatsapp: {
        type: String,
        required: false
    },
    
    
    email: {
        type: String,
        required: false
    },
    
    facebook: {
        type: String,
        required: false
    },

    quemsomos: {
        type: String,
        required: false
    },

    oquefazemos: {
        type: String,
        required: false
    },

    nossamissao: {
        type: String,
        required: false
    },

    diferencial1: {
        type: Object,
        required: false
    },

    diferencial2: {
        type: Object,
        required: false
    },

    diferencial3: {
        type: Object,
        required: false
    },
    diferencial4: {
        type: Object,
        required: false
    },
    slogan: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Sobre', Sobre);