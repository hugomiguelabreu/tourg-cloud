'use strict';
module.exports = (sequelize, DataTypes) => {
    const Guide = sequelize.define('Guide', {
        account_number: DataTypes.STRING,
        swift: DataTypes.STRING
    }, {});
    Guide.associate = function(models) {
        Guide.belongsTo(models['User'], {foreignKey: {allowNull: false, name:'user_id'}});
        Guide.hasMany(models['Activity'], {foreignKey: {allowNull:false, name:'guide_id'}});
        Guide.hasMany(models.Message, {foreignKey: 'guide_id'});
        Guide.hasMany(models.Complaint, {foreignKey: 'guide_id'});
        Guide.hasMany(models.Guide_Evaluation, {foreignKey: 'guide_id'});
    };
    return Guide;
};