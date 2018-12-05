'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
            msg: DataTypes.STRING,
            way: DataTypes.BOOLEAN
        },
        {
            timestamps: true,
            createdAt: 'timestamp',
            updatedAt: false
        });
    Message.associate = function(models) {
        // associations can be defined here
    };
    return Message;
};