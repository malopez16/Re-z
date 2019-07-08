module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Steps',
      'img_url',
      {
        type: Sequelize.STRING,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    ).then(() => {
        return queryInterface.addColumn(
          'Steps', // name of Target model
          'img_key', // name of the key we're adding
          {
            type: Sequelize.STRING,
            allowNull: true,
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        );
      });;
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Steps', // name of Source model
      'img_url' // key we want to remove
    ).then(() => {
        // remove Payment hasOne Order
        return queryInterface.removeColumn(
          'Steps', // name of the Target model
          'img_key' // key we want to remove
        );
      });;
  }
};
