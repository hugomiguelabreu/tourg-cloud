'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Bookings',
                'charge_id',
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                }
            )
        ]);

    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Bookings', 'charge_id')
        ])
    }
};
