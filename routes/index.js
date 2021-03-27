const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const cabinaController = require('../controllers/cabina');
const historialController = require('../controllers/historial');

const version = 'v1';

/*** Health* */
router.get(`/${version}/health`, userController.health);

/** Users */
router.post(`/${version}/auth`, userController.login);
router.post(`/${version}/activate/:email`, userController.activate);

router.post(`/${version}/users`, userController.register);
router.get(`/${version}/users/:id`, userController.getAll);
router.put(`/${version}/users/:id`, userController.editUser);
router.delete(`/${version}/users/:id`, userController.deleteUser);
router.get(`/${version}/users/profile/:id`, userController.getprofile);
router.post(`/${version}/users/changePassword/:id`, userController.changePsw);

/** Cabinas */

router.post(`/${version}/cabinas`, cabinaController.addCabina);
router.get(`/${version}/cabinas/:empresaId`, cabinaController.getAll);
router.put(`/${version}/cabinas/:id`, cabinaController.editCabina);
router.delete(`/${version}/cabinas/:id`, cabinaController.deleteCabina);

/** Historial */

router.post(`/${version}/historiales`, historialController.new);
router.get(`/${version}/historiales/:empresaId`, historialController.getHistorial);
router.put(`/${version}/historiales/:id`, historialController.editHistorial);
router.delete(`/${version}/historiales/:id`, historialController.deleteHistorial);

module.exports = router;