'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity_Evaluation = sequelize.define('Activity_Evaluation', {
        text: DataTypes.TEXT,
        score: DataTypes.INTEGER,
        timestamp: DataTypes.DATE,
        activity_id: DataTypes.INTEGER // FK
    },
    {
        timestamps: true,
        createdAt: 'timestamp',
        updatedAt: false
    });
    Activity_Evaluation.associate = function(models) {
        // associations can be defined here
    };
    return Activity_Evaluation;
};