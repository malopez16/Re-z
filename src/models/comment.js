'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER
  }, {});
  comment.associate = function(models) {
    // associations can be defined here
    comment.belongsToMany(models.user, {as: 'UserVotes', through: 'userComment', foreignKey: 'userId' });
    comment.belongsTo(models.user, {as: 'Author', foreignKey: 'userId'});
    comment.belongsTo(models.Recipe, {as: 'RecipeComments', foreignKey: 'recipeId'});
  };
  return comment;
};