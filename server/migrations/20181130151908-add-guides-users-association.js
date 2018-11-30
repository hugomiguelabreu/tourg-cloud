'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Guides',
          'user_id',
          {
              type: Sequelize.INTEGER,
              unique: true,
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
          'Guides', // name of Source Table
          'user_id' // key we want to remove
      );
  }
};
