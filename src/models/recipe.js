'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    calories: DataTypes.STRING,
    description: DataTypes.STRING,
    img_url: DataTypes.STRING,
    img_key: DataTypes.STRING,
  }, {});
  Recipe.associate = function(models) {
    // associations can be defined here
    Recipe.hasMany(models.Steps, {as: 'RecipeSteps', foreignKey: 'RecipeId', sourceKey: 'id'});
    Recipe.belongsToMany(models.ingredient, { as: 'IngredientsList', through: 'recipeIngredients', foreignKey: 'recipeId' });
    Recipe.belongsTo(models.user, {as: 'Owner', foreignKey: 'userId'});
    Recipe.belongsToMany(models.user, { as: 'Userfollowers', through: 'FavoritesRecipes', foreignKey: 'recipeId' });
    Recipe.hasMany(models.comment, { as: 'RecipeComments', foreignKey: 'recipeId', sourceKey: 'id'});

  };
  return Recipe;
};
