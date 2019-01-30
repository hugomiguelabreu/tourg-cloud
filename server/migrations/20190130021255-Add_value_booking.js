'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Bookings',
                'value',
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                }
            )
        ]);

    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Bookings', 'value')
        ])
    }
};
