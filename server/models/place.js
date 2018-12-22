'use strict';
module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define('Place', {
    title: DataTypes.STRING,
    description: DataTypes.STRING(2000),
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    photo_path: DataTypes.STRING(2000)
  }, {});
  Place.associate = function(models) {
    // associations can be defined here
  };
  return Place;
};
