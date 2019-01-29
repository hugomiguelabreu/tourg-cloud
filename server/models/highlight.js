'use strict';
module.exports = (sequelize, DataTypes) => {
    const Highlight = sequelize.define('Highlight', {
        title: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        timestamps:false
    });
    Highlight.associate = function(models) {
        Highlight.belongsTo(models['Activity'], {foreignKey:'id', sourceKey: 'id'});
    };
    return Highlight;
};