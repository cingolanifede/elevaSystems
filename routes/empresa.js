const express = require('express');
const router = express.Router();
const passport = require('passport');

const EmpresaController = require('../controllers/empresa');
const Mdw = require('../middleware/custom');
const cors = require('../cors');

router.post('/', cors.cors, Mdw.verifyAuthenticated, Mdw.verifyAdmin, EmpresaController.new);

/*Get server token using facebook´s token login system*/
// router.get('/facebook/token', Mdw.facebook, UserController.facebookToken);

module.exports = router;