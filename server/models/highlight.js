'use strict';
module.exports = (sequelize, DataTypes) => {
    const Highlight = sequelize.define('Highlight', {
        title: DataTypes.STRING,
        description: DataTypes.STRING
    }, {});
    Highlight.associate = function(models) {
        Highlight.belongsTo(models['Activity'], {foreignKey: {allowNull: false, name:'highlight_id'}});
    };
    return Highlight;
};