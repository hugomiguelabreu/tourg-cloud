'use strict';
module.exports = (sequelize, DataTypes) => {
    const Credit_Card = sequelize.define('Credit_Card', {
        user_id: DataTypes.INTEGER, // FK
        token: DataTypes.TEXT,
        last_four: DataTypes.TEXT,
        type: DataTypes.TEXT,
    }, {});
    Credit_Card.associate = function(models) {
        Credit_Card.belongsTo(models.User, {foreignKey: 'user_id', target_key: 'id'})
    };
    return Credit_Card;
};