const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    signal_strenght: {
        type: Number
    },
    batery_voltage: {
        type: Number
    }
}, {
    timestamps: true
});

const CabinaShcema = new Schema({
    nombre_edificio: {
        type: String
    },
    direccion_edificio: {
        type: String
    },
    numero_ascensor: {
        type: String
    },
    chip_cabina: {
        type: String
    },
    chip_portadora: {
        type: String
    },
    numero_llave: {
        type: String
    },
    ciudad: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    comments: commentSchema
}, {
    timestamps: true
});


module.exports = mongoose.model('Cabina', CabinaShcema);