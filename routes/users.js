const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const Mdw = require('../middleware/custom');
const cors = require('../cors');

//Users general
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.patch('/changePassword/:userId', cors.corsWithOptions, UserController.changePsw);

//Manejo de Tecnicos / admin user only!
router.post('/tecnico/:empresaId', cors.corsWithOptions, UserController.addTecnico);
router.get('/tecnico/:empresaId', cors.corsWithOptions, UserController.profile);
router.patch('/tecnico/:userId', cors.corsWithOptions, UserController.editTecnico);
router.delete('/tecnico/:userId', cors.corsWithOptions, UserController.deleteUser);

//Get user data
router.get('/:id', cors.corsWithOptions, Mdw.verifyUser, UserController.myProfile);

//Not used!!

// router.put('/:userId', cors.corsWithOptions,  Mdw.verifyUser, Mdw.verifyAdmin, UserController.addEmpresa);
// router.get('/', cors.corsWithOptions,  UserController.all);
/*Get server token using facebook´s token login system*/
// router.get('/facebook/token', Mdw.facebook, UserController.facebookToken);

module.exports = router;