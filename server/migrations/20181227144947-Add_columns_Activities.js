'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Activities',
                'lat',
                {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),

            queryInterface.addColumn(
                'Activities',
                'lng',
                {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Activities', 'lat'),
            queryInterface.removeColumn('Activities', 'lng')
        ])
    }
};
