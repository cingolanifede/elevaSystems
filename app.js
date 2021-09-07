require('dotenv').config();
const express = require('express');
const acl = require('express-acl');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const config = require('./config');
const mongoDb = require('./connection');
const tokenValidation = require('./middleware/token.middleware');

const index_routes = require('./routes/index');

//mongoDB connection
mongoDb.connectDb();

const app = express();

/* ACL config */
let configObject = {
  filename: 'nacl.json',
  baseUrl: config.VERSION,
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

// Healthcheck
app.post('/notifications', (req, res) => {
  console.log(req);
  res.send(req.body);
});

//conectamos todos los routers
app.use('/health', (req, res) => {
    res.status(200).json({
      data: 'online'
    });
});

app.use('/', index_routes);

module.exports = app;
