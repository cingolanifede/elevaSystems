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

      const email = req.body.email;
      const password = req.body.password;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const rol = req.body.rol;
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
          sub: user._id,
          email: user.email
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
    const userId = req.params.userId;
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
  all: async (req, res, next) => {
    const user = await User.find().populate('empresaId');
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
  myProfile: async (req, res, next) => {
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
  profile: async (req, res, next) => {
    const user = await User.find({
      empresaId: req.params.empresaId,
      rol: 'tecnico'
    });
    if (!user) {
      return res.status(400).json({
        error: 'User not found'
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
  addEmpresa: async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (user && req.body.empresaId != null) {
      user.empresaId = mongoose.Types.ObjectId(req.body.empresaId);
      const userUpdate = await user.save();
      const result = await User.findById(userUpdate._id).populate('empresaId');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      return next(new error_types.Error404('Comment ' + req.params.userId + ' not found'));
    }
  },
  addTecnico: async (req, res, next) => {
    try {
      const {
        error
      } = schemaRegisterTech.validate(req.body);

      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }

      const email = req.body.email;
      const password = req.body.password;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const rol = req.body.rol;
      const empresaId = req.params.empresaId;
      const isEmailExist = await User.findOne({
        email
      });
      if (isEmailExist) {
        return res.status(400).json({
          error: 'email already exists'
        });
      } else {
        const user = await User.create({
          firstName,
          lastName,
          email,
          password,
          rol,
          empresaId
        });
        const result = {
          message: 'User created successful',
          user
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
  editTecnico: async (req, res, next) => {
    const techId = req.params.userId;
    const user = await User.findOneAndUpdate({
      _id: techId
    }, req.body, {
      upsert: true
    });
    if (user) {
      const result = await User.findById(techId).populate('empresaId');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      return next(new error_types.Error404('Tecnico ' + techId + ' not found'));
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const result = await User.findOneAndDelete({
        _id: req.params.userId
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