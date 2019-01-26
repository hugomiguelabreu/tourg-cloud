'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Guides',
                'balance',
                {
                    type: Sequelize.DECIMAL(8,2),
                    defaultValue: 0,
                    allowNull: false
                }
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Guides', 'balance')
        ])
    }
};
