'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Activity_Dates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            price: {
                allowNull: false,
                type: Sequelize.DECIMAL(6,2)
            },
            timestamp: {
                allowNull: false,
                type: Sequelize.DATE
            },
            activity_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Activities',
                    key: 'id',
                },
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Activity_Dates');
    }
};