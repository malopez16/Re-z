module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'comments', // name of Source model
      'recipeId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        references: {
         model: 'Recipes', // name of Target model
         key: 'id', // key in Target model that we're referencing
       },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'comments', // name of Source model
      'recipeId' // key we want to remove
    );
  }
};
