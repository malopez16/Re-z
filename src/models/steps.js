'use strict';
module.exports = (sequelize, DataTypes) => {
  const Steps = sequelize.define('Steps', {
    name: DataTypes.STRING,
    position: DataTypes.STRING,
    description: DataTypes.STRING,
    img_url: DataTypes.STRING,
    img_key: DataTypes.STRING,
  }, {});
  Steps.associate = function (models) {
    Steps.belongsTo(models.Recipe);
  };
  return Steps;
};
