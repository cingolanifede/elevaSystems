const express = require('express');
const router = express.Router();

const HistorialController = require('../controllers/historial');
const Mdw = require('../middleware/custom');
const cors = require('../cors');

router.post('/', cors.cors, HistorialController.new);
router.get('/:empresaId', cors.corsWithOptions, Mdw.verifyAuthenticated, HistorialController.getHistorial);

module.exports = router;