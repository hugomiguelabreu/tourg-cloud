'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    description: DataTypes.STRING,
    city: DataTypes.STRING,
    date: DataTypes.DATE,
    price: DataTypes.DECIMAL(6,2)
  }, {});
  Activity.associate = function(models) {
    // 
  };
  return Activity;
};