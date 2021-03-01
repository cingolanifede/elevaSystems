const User = require('../models/user');
const Dish = require('../models/dishes');
const Joi = require('@hapi/joi');
const Helper = require('../helpers/helper');

let controller = {
  getAll: async (req, res) => {
    try {
      // console.log(req.user);
      const dishes = await Dish.find({});
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: dishes
      });
    } catch (error) {
      return res.status(400).json({
        error
      });
    }
  },
  postDish: async (req, res) => {
    try {
      const dish = await Dish.create({
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        label: req.body.label,
        price: req.body.price,
        featured: req.body.featured,
        description: req.body.description,
        comments: []
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: dish
      });
    } catch (error) {
      return res.status(400).json({
        error
      });
    }
  },
  getDishId: async (req, res) => {
    try {
      const dishId = req.params.dishId;
      const dish = await Dish.findOne({
        _id: dishId
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: dish
      });
    } catch (error) {
      return res.status(400).json({
        error
      });
    }
  },
  getDishIdComments: async (req, res) => {
    const dish = await Dish.findById(req.params.dishId).populate('comments.author');
    if (dish != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish.comments);
    } else {
      return res.status(404).json({
        error: 'Dish ' + req.params.dishId + ' not found'
      });
    }
  },
  postDishIdComments: async (req, res) => {
    const dish = await Dish.findById(req.params.dishId);
    if (dish != null) {
      console.log(req.user);
      req.body.author = req.user._id;
      dish.comments.push(req.body);
      const dishSave = await dish.save();
      const result = await Dish.findById(dishSave._id).populate('comments.author');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    }
  },
  getDishIdCommentId: async (req, res, next) => {
    const dish = await Dish.findById(req.params.dishId).populate('comments.author');
    if (dish && dish.comments.id(req.params.commentId) != null) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(dish.comments.id(req.params.commentId));
    } else if (dish == null) {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    } else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  },
  putDishIdCommentId: async (req, res, next) => {
    const dish = await Dish.findById(req.params.dishId);
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      if (req.body.rating) {
        dish.comments.id(req.params.commentId).rating = req.body.rating;
      }
      if (req.body.comment) {
        dish.comments.id(req.params.commentId).comment = req.body.comment;
      }
      const dishSave = await dish.save();
      const result = await Dish.findById(dishSave._id).populate('comments.author');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else if (dish == null) {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    } else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  },
  deleteDishIdCommentId: async (req, res) => {
    const dish = await Dish.findById(req.params.dishId);
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      dish.comments.id(req.params.commentId).remove();
      const dishSave = await dish.save();
      const result = await Dish.findById(dishSave._id).populate('comments.author');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else if (dish == null) {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    } else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  }
};

module.exports = controller;