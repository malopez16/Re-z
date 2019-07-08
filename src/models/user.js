const bcrypt = require('bcrypt');

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, 10);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },

    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    telegram_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    send_notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    telegram_chat_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sessionId: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
  }, {});
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);
  user.associate = function(models) {
    user.hasMany(models.Recipe, {as: 'UserRecipes', foreignKey: 'userId', sourceKey: 'id'});
    user.hasMany(models.ingredient, {as: 'UserIngredients', foreignKey: 'userId', sourceKey: 'id'});
    user.belongsToMany(models.Recipe, { as: 'Favorites', through: 'FavoritesRecipes', foreignKey: 'userId' });
    user.hasMany(models.comment, {as: 'Comments', sourceKey: 'id'});
    user.belongsToMany(models.comment, {as: 'VotedComments', through: 'userComment', sourceKey: 'id'});
    user.belongsToMany(models.Notifications, {through: 'UserNotifications', as:'Notifications', foreignKey: 'userid'})
  };
  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  return user;
};
