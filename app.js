require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const acl = require('express-acl');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const config = require('./config');
const mongoDb = require('./helpers/connection');
const tokenValidation = require('./middleware/token.middleware');

require('./authentication');

//mongoDB connection
mongoDb.connectDb();

//Routes
const index_routes = require('./routes/index');
const user_routes = require('./routes/users');
const cabinas_routes = require('./routes/cabina');
const historial_routes = require('./routes/historial');

const app = express();

/* ACL config */
let configObject = {
  filename: 'nacl.json',
  baseUrl: version,
  roleSearchPath: 'user.rol',
  defaultRole: 'tecnico'
};

let responseObject = {
  status: 'access denied',
  message: 'You are not authorized to access this resource',
};

acl.config(configObject, responseObject);

//Cors para toda la app con '*'
var corsOptions = {
  origin: '*', // Reemplazar con dominio
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
//conectamos todos los middleware de terceros
app.use(logger('dev')); //for develop
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

//Passport initialization required
app.use(passport.initialize());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(express.static(path.join(__dirname, 'public')));

// tokenValidation middleware
app.use(tokenValidation);

/* ACL middleware */
app.use(acl.authorize);

//conectamos todos los routers
app.use('/', index_routes);
app.use('/api/users', user_routes);
app.use('/api/cabinas', cabinas_routes);
app.use('/api/historial', historial_routes);

module.exports = app;