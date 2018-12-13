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
            queryInterface.removeColumn(
                'Activities', // name of Source Table
                'date' // key we want to remove
            ),
            queryInterface.removeColumn(
                'Activities', // name of Source Table
                'price' // key we want to remove
            )
    ]);

    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */ //TODO add down function?
    }
};
