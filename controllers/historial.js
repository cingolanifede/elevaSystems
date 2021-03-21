const mongoose = require('mongoose');

const Cabina = require('../models/cabinas');
const Historial = require('../models/historial');
const error_types = require('../controllers/error_types');
const fcm = require('../helpers/fcm');
const Fail = require('../helpers/fail');

let controller = {
  new: async (req, res, next) => {
    const {chip, na, evento, sb} = req.body.sb;
    const cab = await Cabina.findOne({
      chip_cabina: chip
    });
    if (cab == null) {
      return next(new error_types.Error404('Cabina not found.'));
    } else {
      const {
        signal_strenght,
        batery_voltage
      } = sb.split('-');
      const falla = Fail.fallas2String(evento);
      const info = {
        cabinaId: cab._id,
        empresaId: cab.owner,
        closed: false,
        alerta: true,
        cod: evento,
        evento: falla,
        numero_ascensor: na,
        timestamp: +new Date(),
        signal_strenght,
        batery_voltage
      };
      const newHist = await Historial.create(info);

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(newHist);
      const body = falla + ', ' + cab.direccion_edificio;
      const push = await fcm.sendFCM(cab.owner, 'Falla detectada', body, info);
      console.log('Push --> ', push);
    }
  },
  getHistorial: async (req, res, next) => {
    try {
      const queryLimit = Number(req.query.limit) || 5;
      const querySkip = Number(req.query.skip) || 0;
      const empresaId = req.params.empresaId;
      const cab = await Historial.find({
        empresaId
      }).populate('tecnicoId', '-password').populate('cabinaId');
      const totalHistorial = await Historial.find({
        empresaId
      }).countDocuments();

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        cab,
        totalHistorial
      });
    } catch (error) {
      return next(new error_types.Error404(error));
    }
  },
  editHistorial: async (req, res, next) => {
    const historialId = req.params.id;
    const hist = await Historial.findOneAndUpdate({
      _id: historialId
    }, req.body, {
      upsert: true
    });
    if (hist) {
      const result = await Historial.findById(historialId).populate('tecnicoId', '-password').populate('cabinaId');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      return next(new error_types.Error404('Historial ' + historialId + ' not found'));
    }
  },
  deleteHistorial: async (req, res, next) => {
    try {
      const id = mongoose.Types.ObjectId(req.params.id);
      await Historial.findByIdAndDelete({
        _id: id
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: 'ok'
      });

    } catch (error) {
      return next(new error_types.Error404(error));
    }
  }
};

module.exports = controller;