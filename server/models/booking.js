'use strict';
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
            user_id: DataTypes.INTEGER,
            activity_id: DataTypes.INTEGER,
            activity_date_id: DataTypes.INTEGER,
        },
        {
            timestamps: true,
            updatedAt: false
        });
    Booking.associate = function(models) {
        Booking.belongsTo(models.Activity, {foreignKey: 'activity_id', target_key: 'id'});
        Booking.belongsTo(models.Activity_Date, {foreignKey: 'activity_date_id', target_key: 'id'});
    };
    return Booking;
};