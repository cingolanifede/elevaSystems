const mongoose = require('mongoose');

const Empresa = require('../models/empresa');
const error_types = require('../controllers/error_types');

let controller = {
    new: async (req, res, next) => {
        const fav = await Empresa.findOne({
            nombre: req.body.nombre
        });
        if (fav != null) {
            return next(new error_types.Error400('Empresa already exists'));
        } else {
            const newFav = await Empresa.create({
                nombre: req.body.nombre,
                direccion: req.body.direccion
            });
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                data: newFav
            });
        }
    }
};

module.exports = controller;