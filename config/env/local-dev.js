'use strict';

require('dotenv').config();

// Set the 'local-dev' environment configuration object
module.exports = {
  mysql: {
    host: 'localhost',
    user: process.env.SECRET_DB_USER,
    password: process.env.SECRET_DB_PASSWORD,
    database: 'atms_db',
    port: '3306',
  },
  swagger: {
    version: '1.0.0',
    title: 'Skill Management',
    description: 'Skill Management',
    contact: {
      name: 'vanessa.dizon@awsys-i.com',
    },
  },
  jwt: {
    secretKey: 'qawsedrftgyhujikolp;@:',
    expire: 60 * 60 * 24,
  },
  port: 3001,
};
