module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // name of Source model
      'admin', // name of the key we're adding
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users', // name of Source model
      'admin' // key we want to remove
    );
  }
};
