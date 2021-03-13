const express = require('express');
const router = express.Router();
const passport = require('passport');

const CabinaController = require('../controllers/cabina');
const Mdw = require('../middleware/custom');
const cors = require('../cors');

router.post('/', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, CabinaController.addCabina);
router.get('/:empresaId', cors.cors, Mdw.verifyAuthenticated, CabinaController.getAll);
router.patch('/:cabinaId', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, CabinaController.editCabina);
router.delete('/:cabinaId', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, CabinaController.deleteCabina);

module.exports = router;