'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Bookings',
                'accepted',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true
                }
            ),

            queryInterface.addColumn(
                'Bookings',
                'guide_lat',
                {
                    type: Sequelize.FLOAT,
                    allowNull: true
                }
            ),

            queryInterface.addColumn(
                'Bookings',
                'guide_lng',
                {
                    type: Sequelize.FLOAT,
                    allowNull: true
                }
            ),

            queryInterface.addColumn(
                'Bookings',
                'user_lat',
                {
                    type: Sequelize.FLOAT,
                    allowNull: true
                }
            ),

            queryInterface.addColumn(
                'Bookings',
                'user_lng',
                {
                    type: Sequelize.FLOAT,
                    allowNull: true
                }
            ),

            queryInterface.addColumn(
                'Bookings',
                'guide_review',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true
                }
            ),

            queryInterface.addColumn(
                'Bookings',
                'activity_review',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true
                }
            ),

        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Bookings', 'accepted'),
            queryInterface.removeColumn('Bookings', 'guide_lat'),
            queryInterface.removeColumn('Bookings', 'guide_lng'),
            queryInterface.removeColumn('Bookings', 'user_lat'),
            queryInterface.removeColumn('Bookings', 'user_lng'),
            queryInterface.removeColumn('Bookings', 'guide_review'),
            queryInterface.removeColumn('Bookings', 'activity_review'),
        ])
    }
};
