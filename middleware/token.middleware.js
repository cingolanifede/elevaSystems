const jwt = require('jsonwebtoken');
const config = require('../config');

const tokenValidation = async (req, res, next) => {
  var token = req.headers['authorization'];

  if (!token) return next();

  token = token.replace('Bearer ', '');

  jwt.verify(token, config.JWT_KEY, function (err, tokenDecode) {
    if (err) {
      res.status(401).send({
        status: 401,
        error: 'invalid_token',
        errorMsg: 'Invalid token'
      });
    } else {
      req.user = {
        id: tokenDecode.id,
        email: tokenDecode.email,
        rol: tokenDecode.rol
      };

      return next();
    }
  });
};

module.exports = tokenValidation;