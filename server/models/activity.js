'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    description: DataTypes.STRING,
    city: DataTypes.STRING,
    date: DataTypes.DATE,
    price: DataTypes.DECIMAL(6,2)
  }, {});
  Activity.associate = function(models) {
    Activity.belongsToMany(models.User, {through: 'Activity_Users', foreignKey: 'activity_id'});
    Activity.hasMany(models.Activity_Evaluation, {foreignKey: 'activity_id'})
  };
  return Activity;
};