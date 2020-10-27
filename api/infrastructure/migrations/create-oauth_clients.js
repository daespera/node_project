'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('oauth_clients', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      secret: {
        type: Sequelize.STRING
      }
    }).then();
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('oauth_clients');
  }
};