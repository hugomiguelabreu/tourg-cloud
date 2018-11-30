'use strict';
module.exports = (sequelize, DataTypes) => {
  const Credit_Card = sequelize.define('Credit_Card', {
    number: DataTypes.STRING,
    expiry_date: DataTypes.DATEONLY
  }, {});
  Credit_Card.associate = function(models) {
    Credit_Card.belongsTo(models['User'], {foreignKey: {allowNull: false, name:'user_id'}})
  };
  return Credit_Card;
};