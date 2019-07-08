'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserNotifications = sequelize.define('UserNotifications', {
    userid: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    notificationid: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {});
  UserNotifications.associate = function(models) {
    // associations can be defined here
  };
  return UserNotifications;
};