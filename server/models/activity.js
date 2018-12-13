'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        activity_id: DataTypes.INTEGER,
        guide_id: DataTypes.INTEGER,
        description: DataTypes.STRING,
        city: DataTypes.STRING,
        date: DataTypes.DATE,
        price: DataTypes.DECIMAL(6,2)
    }, {});
    Activity.associate = function(models) {
        Activity.hasMany(models.Activity_Evaluation, {foreignKey: 'activity_id'});
        Activity.hasMany(models.Activity_Date, {foreignKey: 'activity_id'});
    };
    return Activity;
};