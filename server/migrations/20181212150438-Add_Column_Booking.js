'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Bookings',
            'activity_date_id',
            {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
                references: {
                    model: 'Activity_Dates', // name of Target Table
                    key: 'id', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Bookings', // name of Source Table
            'activity_date_id' // key we want to remove
        );
    }
};
