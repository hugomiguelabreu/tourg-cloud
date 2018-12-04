'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      guide_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Guides',
          key: 'id',
        },
      },
      msg: {
        allowNull: false,
        type: Sequelize.STRING
      },
      way: { // true user -> guide | false guide -> user
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Messages');
  }
};