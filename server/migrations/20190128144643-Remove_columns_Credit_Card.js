'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.removeColumn(
                'Credit_Cards', // name of Source Table
                'last_four' // key we want to remove
            ),

            queryInterface.removeColumn(
                'Credit_Cards', // name of Source Table
                'type' // key we want to remove
            ),
            queryInterface.renameColumn(
                'Credit_Cards',
                'token',
                'customer_id')
        ]);
    },

    down: (queryInterface, Sequelize) => {

        return Promise.all([

            queryInterface.addColumn(
                'Credit_Cards',
                'last_four',
                {
                    type: Sequelize.TEXT,

                }
            ),

            queryInterface.addColumn(
                'Credit_Cards',
                'type',
                {
                    type: Sequelize.TEXT,

                }
            )
        ]);
    }
};
