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

require('./authentication');

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
// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
};

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

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
app.use('/health', (req, res) => {
    res.status(200).json({
      data: 'online'
    });
});

app.use('/', cors(corsOptions), index_routes);

module.exports = app;
