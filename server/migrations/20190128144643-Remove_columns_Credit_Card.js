'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Credit_Cards',
                'last_four',
                {
                    type: Sequelize.TEXT,
                    allowNull: false
                }
            ),

            queryInterface.addColumn(
                'Credit_Cards',
                'type',
                {
                    type: Sequelize.TEXT,
                    allowNull: false
                }
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {

        return Promise.all([
            queryInterface.renameColumn(
                'Credit_Cards',
                'customer_id',
                'token'),
            queryInterface.removeColumn('Credit_Cards', 'last_four'),
            queryInterface.removeColumn('Credit_Cards', 'type')
        ]);
    }
};
