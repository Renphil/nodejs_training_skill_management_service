'use strict';
const path = require('path');

module.exports = function (app) {
  // Load the routing files
  require(path.resolve('app/routes/skill.routes.js'))(app);
  require(path.resolve('app/routes/user.routes.js'))(app);
};
