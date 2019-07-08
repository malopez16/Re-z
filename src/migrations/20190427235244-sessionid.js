module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // name of Source model
      'sessionId', // name of the key we're adding
      {
        type: Sequelize.STRING,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users', // name of Source model
      'sessionId' // key we want to remove
    );
  }
};
