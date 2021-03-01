const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresaShcema = new Schema({
    nombre: {
        type: String
    },
    direccion: {
        type: String
    },
    ciudad: {
        type: String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Empresa', EmpresaShcema);