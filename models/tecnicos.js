const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TecnicoShcema = new Schema({
    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: 'user'
    },
    facebookId: String,
    rol: {
        type: String,
        default: 'admin'
    },
    empresaId: {
        type: String
    },
    selected: {
        type: String
    },
    identificacion: {
        type: String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Tecnico', TecnicoShcema);