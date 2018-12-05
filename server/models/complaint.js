'use strict';
module.exports = (sequelize, DataTypes) => {
    const Complaint = sequelize.define('Complaint', {
            text: DataTypes.TEXT,
            way: DataTypes.BOOLEAN,
            timestamp: DataTypes.DATE
        },
        {
            timestamps: true,
            createdAt: 'timestamp',
            updatedAt: false
        });
    Complaint.associate = function(models) {
        // associations can be defined here
    };
    return Complaint;
};