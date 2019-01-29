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
                'photo_path',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null,
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
            queryInterface.removeColumn('Activities', 'photo_path')
        ])
  }
};
