'use strict';

const userModel = require('../models/user.model');
const { userSchema, loginSchema } = require('../../util/validationSchema');
const { createToken } = require('../../middleware/jwt/jwt');
const { errorHandler, throwError } = require('../../util/errorHandler');
const bcrypt = require('bcrypt');
const { ERRORS } = require('../../util/ERRORS');

// route '/api/v1/aws-training-management-system/user/register'
exports.registerUser = async (req, res) => {
  try {
    const {
      aws_email,
      password,
      last_name,
      first_name,
      dev,
    } = await userSchema.validateAsync(req.body);
    const hashedPassword = bcrypt.hash(password, 10);
    const user = {
      aws_email: aws_email,
      password: hashedPassword,
      last_name: last_name,
      first_name: first_name,
      dev: dev,
    };
    const userDbResult = await userModel.registerUser(user);

    return res.status(200).json({ added: userDbResult.affectedRows });
  } catch (err) {
    errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/user/login'
exports.loginUser = async (req, res) => {
  try {
    const { aws_email, password } = await loginSchema.validateAsync(req.body);
    let user = await userModel.getUserByEmail(aws_email);
    if (user.length === 0) {
      throwError(ERRORS.REQUEST_ERROR, 'invalid username/password');
    }
    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      throwError(ERRORS.REQUEST_ERROR, 'invalid username/password');
    } else {
      const bearerToken = await createToken(user[0].aws_email);
      res.status(200).json({ bearerToken: `Bearer ${bearerToken}` });
    }
  } catch (err) {
    errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/user'
exports.getUser = async (req, res) => {
  try {
    if (!req.user) {
      throwError(ERRORS.UNAUTHORIZED, 'Unauthorized');
    }
    res.status(200).json(req.user);
  } catch (err) {
    errorHandling(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/user/logout'
exports.logoutUser = async (req, res) => {
  try {
    req.logout();
    res.status(200).json({ message: 'User logged out' });
  } catch (err) {
    errorHandling(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};
