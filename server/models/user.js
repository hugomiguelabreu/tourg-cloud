'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    bio: DataTypes.STRING,
    photo_path: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsToMany(models.Activity, {through: 'Activity_Users', foreignKey:'user_id'})
  };
  return User;
};