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
        User.hasMany(models.Message, {foreignKey: 'user_id'});
        User.hasMany(models.Complaint, {foreignKey: 'user_id'});
        User.hasMany(models.Activity_Evaluation, {foreignKey: 'user_id'});
        User.hasMany(models.Guide_Evaluation, {foreignKey: 'user_id'});
        User.hasMany(models.Booking, {foreignKey: 'user_id'});
    };
    return User;
};