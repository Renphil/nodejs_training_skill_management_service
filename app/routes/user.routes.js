'use strict';

// Load the 'user' controller
const {
  registerUser,
  getUser,
  loginUser,
  logoutUser,
} = require('../controllers/user.controller');
const passport = require('passport');

module.exports = function (app) {
  /**
   * @swagger
   * /api/v1/aws-training-management-system/user/register:
   *  post:
   *   tags:
   *     - User API
   *   description: Able to add new User.
   *   parameters:
   *     - in: body
   *       name: body
   *       description: user details
   *       required: true
   *       schema:
   *           type: object
   *           required:
   *            - aws_email
   *            - password
   *            - first_name
   *            - last_name
   *            - dev
   *           properties:
   *             aws_email:
   *               type: string
   *             password:
   *               type: string
   *             first_name:
   *               type: string
   *             last_name:
   *               type: string
   *             dev:
   *               type: string
   *           example:
   *             aws_email: "renphil.balantin@awsys-i.com"
   *             password: "password"
   *             first_name: "Renphil"
   *             last_name: "Balantin"
   *             dev: "B"
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "addded": "1"}
   *     422:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "\"aws_email\" is required" }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   */
  app
    .route('/api/v1/aws-training-management-system/user/register')
    .post(registerUser);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/user/login:
   *  post:
   *   tags:
   *     - User API
   *   description: Able to authenticate User.
   *   parameters:
   *     - in: body
   *       name: body
   *       description: aws_email and password
   *       required: true
   *       schema:
   *         type: object
   *         properties:
   *           aws_email:
   *             type: string
   *           password:
   *             type: string
   *         example:
   *           aws_email: "renphil.balantin@awsys-i.com"
   *           password: "password"
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "bearerToken": "Bearer + <token>"}
   *     401:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "incorrect email/password" }
   *     422:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "\"aws_email\" is required" }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   *
   */
  app
    .route('/api/v1/aws-training-management-system/user/login')
    .post(loginUser);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/user:
   *  get:
   *   tags:
   *     - User API
   *   description: Able to get user
   *   security:
   *     - BearerAuth: []
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "aws_email": "renphil.balantin@awsys-i.com",
   *      "last_name": "Balantin",
   *      "first_name": "Renphil",
   *      "dev": "B"}
   *     401:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error": "Unauthorized" }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   * schemes:
   *   - http
   *   - https
   * securityDefinitions:
   *   BearerAuth:
   *     type: apiKey
   *     name: Authorization
   *     in: header
   *     scheme: bearer
   */
  app
    .route('/api/v1/aws-training-management-system/user')
    .get(passport.authenticate('jwt', { session: false }), getUser);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/user/logout:
   *  get:
   *   tags:
   *     - User API
   *   description: Able to get user
   *   security:
   *     - BearerAuth: []
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "message": "User logged out"}
   *     401:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error": "Unauthorized" }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   * schemes:
   *   - http
   *   - https
   * securityDefinitions:
   *   BearerAuth:
   *     type: apiKey
   *     name: Authorization
   *     in: header
   *     scheme: bearer
   */
  app
    .route('/api/v1/aws-training-management-system/user/logout')
    .get(passport.authenticate('jwt', { session: false }), logoutUser);
};
