'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger(
  'system'
);

exports.registerUser = (user) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/postUser.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [
      user.aws_email,
      user.password,
      user.last_name,
      user.first_name,
      user.dev,
    ])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

exports.getUserByEmail = (email) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/getUserByEmail.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, email)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};
