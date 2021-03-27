const mongoose = require('mongoose');

const Cabina = require('../models/cabinas');
const error_types = require('../controllers/error_types');

let controller = {
  addCabina: async (req, res, next) => {
    const newCabina = await Cabina.create(req.body);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      data: newCabina
    });
  },
  getAll: async (req, res, next) => {
    try {
      const empresaId = req.params.empresaId;
      const cab = await Cabina.find({
        owner: empresaId
      }).populate('owner', '-password');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(cab);
    } catch (error) {
      return next(new error_types.Error404(error));
    }
  },
  editCabina: async (req, res, next) => {
    const cabinaId = req.params.id;
    const cabina = await Cabina.findOneAndUpdate({
      _id: cabinaId
    }, req.body, {
      upsert: true
    });
    if (cabina) {
      const result = await Cabina.findById(cabinaId).populate('owner','-password');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      return next(new error_types.Error404('Cabina ' + cabinaId + ' not found'));
    }
  },
  deleteCabina: async (req, res, next) => {
    try {
      const id = mongoose.Types.ObjectId(req.params.id);
      const result = await Cabina.findByIdAndDelete({
        _id: id
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        result: true
      });

    } catch (error) {
      return next(new error_types.Error404(error));
    }
  }
};

module.exports = controller;