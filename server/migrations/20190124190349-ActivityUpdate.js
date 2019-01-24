'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.


      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([

            queryInterface.addColumn(
                'Activities',
                'n_people',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),

            queryInterface.addColumn(
                'Activities',
                'duration',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),
        ]);
      },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
            queryInterface.removeColumn('Activities', 'n_people'),
            queryInterface.removeColumn('Activities', 'duration')
        ])
  }
};

