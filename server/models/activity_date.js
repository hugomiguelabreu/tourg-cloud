'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity_Date = sequelize.define('Activity_Date', {
        price: DataTypes.DECIMAL(6,2),
        timestamp: DataTypes.DATE,
        activity_id: DataTypes.INTEGER
        },
        {
            timestamps: false
        });
    Activity_Date.associate = function(models) {
        Activity_Date.hasMany(models.Booking, {foreignKey: 'id'});
    };
    return Activity_Date;
};