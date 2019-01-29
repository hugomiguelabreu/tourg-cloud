'use strict';
module.exports = (sequelize, DataTypes) => {
    const Card = sequelize.define('Card', {
        customer_id: DataTypes.TEXT,
        type: DataTypes.TEXT,
        last_four: DataTypes.TEXT,
        user_id: DataTypes.INTEGER
    }, {});
    Card.associate = function(models) {
        Card.belongsTo(models.User, {foreignKey: 'user_id', target_key: 'id'})
    };
    return Card;
};