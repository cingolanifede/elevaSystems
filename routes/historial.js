const express = require('express');
const router = express.Router();

const HistorialController = require('../controllers/historial');
const Mdw = require('../middleware/custom');
const cors = require('../cors');

router.post('/', cors.cors, HistorialController.new);
router.get('/:empresaId', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyUser, HistorialController.getHistorial);
router.put('/:historialId', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyUser, HistorialController.editHistorial);
router.delete('/:historialId', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, HistorialController.deleteHistorial);

module.exports = router;