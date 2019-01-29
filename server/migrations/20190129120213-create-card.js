'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Cards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            customer_id: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            type: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            last_four: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // name of Target Table
                    key: 'id', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Cards');
    }
};