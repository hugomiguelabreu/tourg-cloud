'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return Promise.all([

          queryInterface.addColumn(
              'Users',
              'notification_token',
              {
                  type: Sequelize.TEXT,
                  allowNull: true
              }
          ),
          queryInterface.addColumn(
              'Guides',
              'notification_token',
              {
                  type: Sequelize.TEXT,
                  allowNull: true
              }
          )
      ]);
  },

  down: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.removeColumn('Users', 'notification_token'),
          queryInterface.removeColumn('Guides', 'notification_token')
      ])
  }
};
