var Sequelize = require('sequelize'),
    model;

const usersRepo = require('./users.repository');

module.exports = {
   ...require('../../infrastructure/base.controller')(usersRepo),
};