require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const config = require('./config');
const mongoDb = require('./helpers/connection');
require('./authentication');

//mongoDB connection
mongoDb.connectDb();

//Routes
const index_routes = require('./routes/index');
const user_routes = require('./routes/users');
const cabinas_routes = require('./routes/cabina');
const historial_routes = require('./routes/historial');

const app = express();

//conectamos todos los middleware de terceros
app.use(logger('dev')); //for develop
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Passport initialization required
app.use(passport.initialize());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(express.static(path.join(__dirname, 'public')));

//conectamos todos los routers
app.use('/', index_routes);
app.use('/api/users', user_routes);
app.use('/api/cabinas', cabinas_routes);
app.use('/api/historial', historial_routes);

module.exports = app;