'use strict';
module.exports = (sequelize, DataTypes) => {
  const Credit_Card = sequelize.define('Credit_Card', {
    number: DataTypes.STRING,
    expiry_date: DataTypes.DATEONLY
  }, {});
  Credit_Card.associate = function(models) {
    // associations can be defined here
  };
  return Credit_Card;
};