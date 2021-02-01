'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_attributes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      attribute: {
        allowNull: false,
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
      }
    }).then();
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_attributes');
  }
};