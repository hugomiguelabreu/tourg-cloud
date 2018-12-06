'use strict';
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
            user_id: DataTypes.INTEGER,
            activity_id: DataTypes.INTEGER,
            timestamp: DataTypes.DATE
        },
        {
            timestamps: true,
            updatedAt: false
        });
    Booking.associate = function(models) {
        // associations can be defined here
    };
    return Booking;
};