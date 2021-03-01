const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const Mdw = require('../middleware/custom');
const cors = require('../cors');

//Users general
router.post('/login', cors.cors, UserController.login);
router.post('/register', cors.cors, UserController.register);

// router.get('/', cors.corsWithOptions, Mdw.verifyAuthenticated, UserController.all);

//Tecnicos 
router.post('/tecnico', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, UserController.addTecnico);
router.put('/tecnico/:userId', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, UserController.editTecnico);
router.delete('/tecnico/:userId', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, UserController.deleteUser);

//Admin
router.get('/:empresaId', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyUser, UserController.profile);
router.put('/:userId', cors.corsWithOptions, Mdw.verifyAuthenticated, Mdw.verifyUser, Mdw.verifyAdmin, UserController.addEmpresa);

/*Get server token using facebook´s token login system*/
// router.get('/facebook/token', Mdw.facebook, UserController.facebookToken);

module.exports = router;