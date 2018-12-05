'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Guide_Evaluations', {
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
            guide_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Guides',
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
        return queryInterface.dropTable('Guide_Evaluations');
    }
};