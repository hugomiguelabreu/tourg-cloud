'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity_Date = sequelize.define('Activity_Date', {
        price: DataTypes.DECIMAL(6,2),
        timestamp: DataTypes.DATE,
        activity_id: DataTypes.INTEGER // FK
        },
        {
            timestamps: false
        });
    Activity_Date.associate = function(models) {
        Activity_Date.hasOne(models.Booking, {foreignKey: 'activity_date_id'});
    };
    return Activity_Date;
};