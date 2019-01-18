'use strict';
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
            user_id: DataTypes.INTEGER,
            activity_id: DataTypes.INTEGER,
            activity_date_id: DataTypes.INTEGER,
            accepted: DataTypes.BOOLEAN,
            guide_lat: DataTypes.FLOAT,
            guide_lng: DataTypes.FLOAT,
            user_lat: DataTypes.FLOAT,
            user_lng: DataTypes.FLOAT,
            guide_review: DataTypes.BOOLEAN,
            activity_review: DataTypes.BOOLEAN
        },
        {
            timestamps: true,
            updatedAt: false
        });
    Booking.associate = function(models) {
        Booking.belongsTo(models.Activity, {foreignKey: 'activity_id', target_key: 'id'});
        Booking.belongsTo(models.Activity_Date, {foreignKey: 'activity_date_id', target_key: 'id'});
        Booking.belongsTo(models.User, {foreignKey: 'user_id', target_key: 'id'})
    };
    return Booking;
};