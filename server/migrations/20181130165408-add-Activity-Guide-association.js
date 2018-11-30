'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Activities',
          'guide_id',
          {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Guides', // name of Target Table
                  key: 'id', // key in Target model that we're referencing
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',

          }
      );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Activities', // name of Source Table
          'guide_id' // key we want to remove
      );
  }
};
