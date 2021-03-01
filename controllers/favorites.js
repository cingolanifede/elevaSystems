const mongoose = require('mongoose');

const Dish = require('../models/dishes');
const Favorites = require('../models/favorites');
const error_types = require('../controllers/error_types');

let controller = {
  getAll: async (req, res, next) => {
    const userId = req.user._id;
    const fav = await Favorites.find({
        user: userId
      }).populate('user')
      .populate('dishes'); //es una opcion mostrar el dish!!
    if (!fav) {
      return res.status(400).json({
        error: 'Favorites not found'
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      data: fav
    });
  },
  postDish: async (req, res, next) => {
    const dishId = req.params.dishId;
    const userId = req.user._id;
    console.log(userId);
    const fav = await Favorites.findOne({
      user: userId
    });
    if (fav != null) {
      const resultado = fav.dishes.filter(fav => fav === dishId);
      console.log(resultado);
      if (resultado.length > 0) {
        return res.status(400).json({
          error: 'Favorite already exists'
        });
      } else {
        const doc = await Favorites.updateOne({
          user: userId
        }, {
          $push: {
            dishes: [mongoose.Types.ObjectId(dishId)]
          }
        }, {
          new: true,
          upsert: true
        });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
          data: doc
        });
      }
    } else {
      //add favorite!
      const newFavorite = await Favorites.create({
        user: userId,
        dishes: [mongoose.Types.ObjectId(dishId)]
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        data: newFavorite
      });
    }
  },
  deleteDishId: async (req, res, next) => {
    const dish = await Favorites.findOne({
      dishes: mongoose.Types.ObjectId(req.params.dishId)
    });
    if (dish) {
      dish.dishes.pull(req.params.dishId);
      const dishSave = await dish.save();
      console.log(dish);
      const result = await Dish.findById(dishSave._id).populate('user').populate('dishes');
      if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
      } else {
        return next(new error_types.Error404('Dish ' + req.params.dishId + ' not found'));
      }
    } else {
      return next(new error_types.Error404('Dish ' + req.params.dishId + ' not found'));
    }
  }
};

module.exports = controller;