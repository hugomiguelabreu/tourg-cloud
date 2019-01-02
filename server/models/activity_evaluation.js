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
        Activity_Evaluation.belongsTo(models.Activity, {foreignKey: 'activity_id', target_key: 'id'})
    };
    return Activity_Evaluation;
};