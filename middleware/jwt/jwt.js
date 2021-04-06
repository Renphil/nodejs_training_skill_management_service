const JWT = require('jsonwebtoken');
const path = require('path');
const logger = require('../logging/logger').getLogger('system');
const config = require(path.resolve('middleware/config/config'));

const createToken = (email) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      { email },
      config.jwt.secretKey,
      { expiresIn: config.jwt.expire },
      (err, token) => {
        if (err) {
          logger.error('jwt error:', err);
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};

module.exports = { createToken };
