'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Bookings',
                'guide_evaluation_id',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Guide_Evaluations', // name of Target Table
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            ),

            queryInterface.addColumn(
                'Bookings',
                'activity_evaluation_id',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Activity_Evaluations', // name of Target Table
                        key: 'id', // key in Target model that we're referencing
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }
            )

        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Bookings', 'guide_evaluation_id'),
            queryInterface.removeColumn('Bookings', 'activity_evaluation_id')
        ])
    }
};
