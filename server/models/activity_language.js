'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity_Language = sequelize.define('Activity_Language', {
        activity: DataTypes.INTEGER,
        language: DataTypes.INTEGER
    }, {});
    Activity_Language.associate = function(models) {
        Activity_Language.belongsTo(models['Activity'], {foreignKey: 'activity'});
        Activity_Language.belongsTo(models['Language'], {foreignKey: 'language'});
    
    };
    return Highlight;
};