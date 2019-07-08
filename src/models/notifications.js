'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    contents: DataTypes.STRING,
    link: DataTypes.STRING,
    checked: DataTypes.BOOLEAN,
  }, {});
  Notifications.associate = function(models) {
    // associations can be defined here
    Notifications.belongsToMany(models.user, {
      through: 'UserNotifications',
      as: 'user',
      foreignKey: 'notificationid'
    });
  };
  return Notifications;
};
