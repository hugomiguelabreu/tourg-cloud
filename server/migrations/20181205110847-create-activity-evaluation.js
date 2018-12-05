'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Activity_Evaluations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            activity_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Activities',
                    key: 'id',
                },
            },
            text: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            score: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            timestamp: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Activity_Evaluations');
    }
};