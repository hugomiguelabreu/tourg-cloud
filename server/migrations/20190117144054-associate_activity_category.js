'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Activities',
            'category_id',
            {
                type: Sequelize.INTEGER,
                defaultValue: '1',
                allowNull: false,
                references: {
                    model: 'Categories', // name of Target Table
                    key: 'id', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Activities', // name of Source Table
            'category_id' // key we want to remove
        );
    }
};
