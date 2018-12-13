'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Bookings', // name of Source Table
          'timestamp' // key we want to remove
      );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Bookings',
          'timestamp',
          {
              allowNull: false,
              type: Sequelize.DATE
          }
      );
  }
};
