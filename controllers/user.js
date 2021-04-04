const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Joi = require('@hapi/joi');
const config = require('../config');
const helper = require('../helpers/helper');
const error_types = require('../controllers/error_types');
const { sendMail } = require('../helpers/mail');

//Validations
const schemaRegister = Joi.object({
  firstName: Joi.string().empty().required(),
  lastName: Joi.string().empty().required(),
  empresaId: Joi.string().empty(),
  owner: Joi.string().empty(),
  email: Joi.string().required().email(),
  password: Joi.string().empty().required(),
  rol: Joi.string().empty().required(),
  selected: Joi.bool().allow(null),
  active: Joi.bool().allow(null)
});

const schemaLogin = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().empty().required()
});

let controller = {
  health: (req, res, next) => {
    return res.status(200).send({
      status:'online'
    });
  },
  activate: async (req, res, next) => {
    const { email } = req.params;
    if (!email) {
      return res.status(404).send({
        error: 'email does not exist'
      });
    }
    const user = await User.find({ email: email });
    if (user){
      const result = await User.updateOne({ email:email}, { active:true });
      res.status(200).send(result);
    }else{
      return res.status(404).send({
        error: 'email does not exist'
      });
    }
  },
  register: async (req, res) => {
    try {
      const { error } = schemaRegister.validate(req.body);

      if (error) {
        return res.status(400).send({
          error: error.details[0].message
        });
      }

      const { email, password, firstName, lastName, rol, empresaId, selected, active } = req.body;

      if (!email || !password) {
        return res.status(404).send({
          error:'missing data'
        });
      }

      if (await User.findOne({ email })) {
        return res.status(400).send({ error: 'email already exists' });
      } else {
        const user = await User.create({ email, password, firstName, lastName, rol, empresaId, selected, active });
        const result = {
          error: false,
          message: 'Signup successful',
          user
        };
        
        let obj = {};
        obj.to = user.email;
        obj.subject ='Usuario registrado';
        sendMail(obj);

        
        res.status(200).send({
          response: result
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  login: async(req, res, next) => {
    console.log('login');
    const { error } = schemaLogin.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: error.details[0].message
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        error: 'email does not exist'
      });
    }
    if (!await user.isValidPassword(password)) {
      return res.status(404).send({error: 'not valid password' });
    }

    if (!user.active && user.rol == 'admin') {
      return res.status(401).send({
        error: 'pending'
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      rol: user.rol
    };

    const token = jwt.sign(payload, config.config.tokenSecret, {
      expiresIn: 60 * 60 * 24 * 10 // expires in 10 days
    });
    user.password = undefined; //hide password
    res.status(200).send({
      response: {
        error: false,
        user,
        token
      }
    });
  },
  changePsw: async (req, res, next) => {
    const userId = req.params.id;
    const oldP = req.body.oldPassword;
    const newP = req.body.newPassword;
    const user = await User.findOne({
      _id: userId
    });
    if (!user) {
      return next(new error_types.Error404('User ' + userId + ' not found'));
    }

    if (!await user.isValidPassword(oldP)) {
      return next(new error_types.Error404('Password ingresado no corresponde'));
    }
    const hash = await bcrypt.hash(newP, 10);
    user.password = hash;
    const result = await user.save();
    if (result) {
      res.status(200).send(result);
    } else {
      return next(new error_types.Error404('User ' + userId + ' not found'));
    }
  },
  getAll: async (req, res, next) => {
    const user = await User.find({
      empresaId: req.params.id
    }).populate('empresaId', '-password');
    if (!user) {
      return res.status(400).send({
        error: 'Users not found'
      });
    }

    let allData = [];
    for (let i = 0; i < user.length; i++) {
      const response = await helper.deleteObj(user[i].toObject());
      allData.push(response);
    }
    return res.status(200).send(await Promise.all(allData));
  },
  getprofile: async (req, res, next) => {
    const user = await User.findOne({
      _id: req.params.id
    }).populate('empresaId', '-password');
    if (!user) {
      return res.status(400).send({
        error: 'User not found'
      });
    }
    
    res.status(200).send(user);
  },
  editUser: async (req, res, next) => {
    const userId = req.params.id;
    const { password, firstName, lastName, selected, active } = req.body;
    const user = await User.updateOne({ _id: userId }, { password, firstName, lastName, selected, active });
    if (user) {
      const result = await User.findById(userId).populate('empresaId', '-password');
      
      res.status(200).send(result);
    } else {
      return next(new error_types.Error404('Tecnico ' + userId + ' not found'));
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await User.findOneAndDelete({
        _id: req.params.id
      });
      
      res.status(200).send({
        data: 'ok'
      });

    } catch (error) {
      return next(new error_types.Error404(error));
    }
  }
};

module.exports = controller;
