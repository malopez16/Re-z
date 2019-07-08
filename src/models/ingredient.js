'use strict';
module.exports = (sequelize, DataTypes) => {
  const ingredient = sequelize.define('ingredient', {
    name: DataTypes.STRING,
    calories: DataTypes.STRING
  }, {});
  ingredient.associate = function(models) {
    // associations can be defined here
    ingredient.belongsToMany(models.Recipe, { as: 'RecipeList', through: 'recipeIngredients', foreignKey: 'ingredientId' })
    ingredient.belongsTo(models.user, {as: 'Owner', foreignKey: 'userId'});
  };
  return ingredient;
};
