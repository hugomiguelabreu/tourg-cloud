'use strict';
module.exports = (sequelize, DataTypes) => {
    const Guide_Evaluation = sequelize.define('Guide_Evaluation', {
            text: DataTypes.TEXT,
            score: DataTypes.INTEGER,
            timestamp: DataTypes.DATE,
            user_id: DataTypes.INTEGER,
            guide_id: DataTypes.INTEGER
        },
        {
            timestamps: true,
            createdAt: 'timestamp',
            updatedAt: false
        });
    Guide_Evaluation.associate = function(models) {
        Guide_Evaluation.belongsTo(models.Guide, {foreignKey: 'guide_id', target_key: 'id'})
    };
    return Guide_Evaluation;
};