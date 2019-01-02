'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Activities',
            'title',
            {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: 'Title',
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Activities', // name of Source Table
            'title' // key we want to remove
        );
    }
};
