'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Activities',
                'price',
                {
                    type: Sequelize.DECIMAL(6,2),
                    defaultValue: 88,
                    allowNull: false
                }
            ),

            queryInterface.addColumn(
                'Activities',
                'min_people',
                {
                    type: Sequelize.INTEGER,
                    defaultValue: 1,
                    allowNull: false
                }
            ),

        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Activities', 'price'),
            queryInterface.removeColumn('Activities', 'min_people')
        ])
    }
};
