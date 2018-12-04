'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activity_Users = sequelize.define('Activity_Users', {
    user_id: DataTypes.STRING,
    activity_id: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  Activity_Users.associate = function(models) {
    // associations can be defined here
  };
  return Activity_Users;
};