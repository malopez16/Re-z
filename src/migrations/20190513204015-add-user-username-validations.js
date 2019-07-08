'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.changeColumn('users', 'username',
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
          unique: true,
        }),
      queryInterface.changeColumn('users', 'email',
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
          unique: true,
        }),
      queryInterface.changeColumn('users', 'password',
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.changeColumn('users', 'username',
        {
          type: Sequelize.STRING,
        }),
      queryInterface.changeColumn('users', 'email',
        {
          type: Sequelize.STRING,
        }),
      queryInterface.changeColumn('users', 'password',
        {
          type: Sequelize.STRING,
        }),
    ]);
  },
};
