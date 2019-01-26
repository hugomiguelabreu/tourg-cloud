'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        guide_id: DataTypes.INTEGER, // FK
        title: DataTypes.TEXT,
        description: DataTypes.STRING,
        city: DataTypes.STRING,
        lat: DataTypes.FLOAT,
        lng: DataTypes.FLOAT,
        category_id: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        min_people: DataTypes.INTEGER,
        n_people: DataTypes.INTEGER,
        duration: DataTypes.INTEGER,
    }, {});
    Activity.associate = function(models) {
        Activity.hasMany(models.Activity_Evaluation, {foreignKey: 'activity_id'});
        Activity.hasMany(models.Activity_Date, {foreignKey: 'activity_id'});
        Activity.belongsTo(models.Guide, {foreignKey: 'guide_id'});
        Activity.belongsTo(models.Category, {foreignKey: 'category_id'});
        Activity.hasMany(models.Booking, {foreignKey: 'activity_id', sourceKey: 'id'})
    };
    return Activity;
};