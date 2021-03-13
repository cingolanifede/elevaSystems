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

const HistorialShcema = new Schema({
    chip: {
        type: String
    },
    cabinaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cabina'
    },
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tecnicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    evento: {
        type: String
    },
    codFalla: {
        type: String
    },
    comments: commentSchema,
    closed: {
        type: Boolean
    },
    alerta: {
        type: Boolean
    },
    pendiente: {
        type: String
    },
    finishedAt: {
        type: Date
    },
    selected: {
        type: Boolean
    },
    result: {
        type: String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Historial', HistorialShcema);