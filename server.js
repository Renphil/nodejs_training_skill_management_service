'use strict';

// Import library
const path = require('path');
const logger = require(path.resolve('middleware/logging/logger'));

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'local-dev';
//process.env.NODE_ENV = 'production';
//process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = 'test';

// Load the module dependencies
const configureExpress = require(path.resolve('middleware/express/express'));
const config = require(path.resolve('middleware/config/config'));
// Create a new Express application instance
const app = configureExpress();

// The port of communication with the application:
var port = process.env.APP_PORT || config.port;
app.set('port', port);

// Listen on provided port, on all network interfaces.
app.listen(port, () => {
  logger.getLogger('system').info('API running on localhost:' + port);
});

module.exports = app;
