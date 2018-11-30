'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Credit_Cards',
          'user_id',
          {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Users', // name of Target Table
                  key: 'id', // key in Target model that we're referencing
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',

          }
      );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Credit_Cards', // name of Source model
          'user_id' // key we want to remove
      );
  }
};
