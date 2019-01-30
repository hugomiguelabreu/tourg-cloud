'use strict';
module.exports = (sequelize, DataTypes) => {
    const Language = sequelize.define('Language', {
        name: {type: DataTypes.STRING, primaryKey: true}
    }, {
        timestamps: false
    });
    Language.associate = function(models) {
        Language.hasMany(models.Activity_Language, {foreignKey: 'id'});
    };
    return Language;
};