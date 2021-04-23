'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'contents', 
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING
        },
        type: {
          allowNull: false,
          type: Sequelize.ENUM,
          defaultValue: 'BLOG',
          values: ['BLOG', 'CONTENT', 'OTHER']
        },
        slug: {
          allowNull: false,
          type: Sequelize.STRING
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        content: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        status: {
          allowNull: false,
          type: Sequelize.ENUM,
          defaultValue: 'DISABLED',
          values: ['ACTIVE', 'BLOCKED', 'DISABLED']
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
      queryInterface.addIndex("contents", ["slug"], {
        unique: true
      });
    });;
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Contents');
  }
};