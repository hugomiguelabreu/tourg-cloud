'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Highlights',
          'activity_id',
          {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Activities', // name of Target Table
                  key: 'id', // key in Target model that we're referencing
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
          }
      );
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Highlights', // name of Source Table
          'activity_id' // key we want to remove
      );
  }
};
