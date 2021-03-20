const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Joi = require('@hapi/joi');
const config = require('../config');
const helper = require('../helpers/helper');
const error_types = require('../controllers/error_types');
const {
  findOneAndUpdate
} = require('../models/user');

//Validations
const schemaRegister = Joi.object({
  firstName: Joi.string().empty().required(),
  lastName: Joi.string().empty().required(),
  email: Joi.string().required().email(),
  password: Joi.string().empty().required(),
  rol: Joi.string().empty().required()
});

const schemaRegisterTech = Joi.object({
  firstName: Joi.string().empty().required(),
  lastName: Joi.string().empty().required(),
  email: Joi.string().required().email(),
  password: Joi.string().empty().required(),
  rol: Joi.string().empty().required(),
  empresaId: Joi.string().empty().required(),
  selected: Joi.bool().empty().required()
});

const schemaLogin = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().empty().required()
});

let controller = {
  register: async (req, res, next) => {
    try {
      const {
        error
      } = schemaRegister.validate(req.body);

      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      const {
        email,
        password,
        firstName,
        lastName,
        rol,
        empresaId
      } = req.body;
      const isEmailExist = await User.findOne({
        email
      });

      if (isEmailExist) {
        return res.status(400).json({
          error: 'email already exists'
        });
      } else {
        const user = await User.create({
          email,
          password,
          firstName,
          lastName,
          empresaId,
          rol
        });
        const result = {
          error: false,
          message: 'Signup successful',
          user
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          response: result
        });
      }
    } catch (error) {
      next(err);
    }
  },
  login: (req, res, next) => {
    console.log('login');
    passport.authenticate('local', {
      session: false
    }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          error: 'User login fail'
        });
      } else {
        const {
          error
        } = schemaLogin.validate(req.body);

        if (error) {
          return res.status(400).json({
            error: error.details[0].message
          });
        }

        const payload = {
          id: user._id,
          email: user.email,
          rol: user.rol
        };

        const token = jwt.sign(payload, config.JWT_KEY, {
          expiresIn: config.JWT_LIFETIME // expires
        });
        res.status(200).json({
          response: {
            error: false,
            id: user._id,
            token
          }
        });
      }
    })(req, res);
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
    const validPassword = await user.isValidPassword(oldP);
    console.log(validPassword);
    if (!validPassword) {
      return next(new error_types.Error404('Password ingresado no corresponde'));
    }
    const hash = await bcrypt.hash(newP, 10);
    user.password = hash;
    const result = await user.save();
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      return next(new error_types.Error404('User ' + userId + ' not found'));
    }
  },
  getAll: async (req, res, next) => {
    const user = await User.find({
      empresaId: req.params.id
    }).populate('empresaId');
    if (!user) {
      return res.status(400).json({
        error: 'Users not found'
      });
    }

    let allData = [];
    for (let i = 0; i < user.length; i++) {
      const response = await helper.deleteObj(user[i].toObject());
      allData.push(response);
    }
    console.log(allData);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(await Promise.all(allData));
  },
  getprofile: async (req, res, next) => {
    const user = await User.findOne({
      _id: req.params.id
    }).populate('empresaId');
    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  },
  editUser: async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findOneAndUpdate({
      _id: userId
    }, req.body, {
      upsert: true
    });
    if (user) {
      const result = await User.findById(userId).populate('empresaId');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      return next(new error_types.Error404('Tecnico ' + userId + ' not found'));
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await User.findOneAndDelete({
        _id: req.params.id
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: 'ok'
      });

    } catch (error) {
      return next(new error_types.Error404(error));
    }
  }
};

module.exports = controller;