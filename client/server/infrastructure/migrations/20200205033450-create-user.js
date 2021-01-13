'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users', 
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING
        },
        first_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        last_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING
        },
        type: {
          allowNull: false,
          type: Sequelize.ENUM,
          values: ['ADMIN', 'SUPER_USER', 'USER']
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    ).then(() => {
      queryInterface.addIndex("users", ["email"], {
        unique: true
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};