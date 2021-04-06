'use strict';

// Load the module dependencies
const path = require('path');
const express = require('express');
const logger = require(path.resolve('middleware/logging/logger'));
const swaggerDocs = require(path.resolve('middleware/jsdocs/swagger'));
const passportConfig = require(path.resolve('middleware/passport/passport'));
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');

// Define the Express configuration method
module.exports = function () {
  // Create a new Express application instance
  const app = express();

  // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    logger.getLogger('system').debug('NODE_ENV:' + process.env.NODE_ENV);
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  //Passport
  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig(passport);

  // Routing log directory
  app.use('/log', express.static(path.resolve('log')));

  // body parser
  app.use(express.json());

  // Write access logs
  app.use(logger.connectLogger(logger.getLogger('access')));

  // Configure swagger api documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Configure static file serving
  app.use('/lib', express.static(path.resolve('./node_modules')));
  require(path.resolve('middleware/router/router'))(app);

  // Configure the route
  require(path.resolve('config/router'))(app);

  // Error handle.
  app.use((err, req, res, next) => {
    if (err) {
      logger.getLogger('system').error(err);
    }
    next(err);
  });

  // Return the Express application instance
  return app;
};
