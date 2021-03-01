const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const Mdw = require('../middleware/custom');
const cors = require('../cors');

//Users general
router.post('/login', UserController.login);
router.post('/register', UserController.register);

//Manejo de Tecnicos / admin user only!
router.post('/tecnico', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyAdmin, UserController.addTecnico);
router.put('/tecnico/:userId', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyAdmin, UserController.editTecnico);
router.delete('/tecnico/:userId', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyAdmin, UserController.deleteUser);

//Get all tecnicos from empresaId
router.get('/:empresaId', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyUser, UserController.profile);

//Get user data
router.get('/:id', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyUser, UserController.myProfile);

//Not used!!

// router.put('/:userId', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyUser, Mdw.verifyAdmin, UserController.addEmpresa);
// router.get('/', cors.corsWithOptions, Mdw.verifyAuthenticated, UserController.all);
/*Get server token using facebook´s token login system*/
// router.get('/facebook/token', Mdw.facebook, UserController.facebookToken);

module.exports = router;