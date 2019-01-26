'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Activity_Languages',
          'language',
          {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Languages', // name of Target Table
                  key: 'id', // key in Target model that we're referencing
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
          }
      );
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Activity_Languages', // name of Source Table
          'language' // key we want to remove
      );
  }
};
