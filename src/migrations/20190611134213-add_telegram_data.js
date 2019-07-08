'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.addColumn(
     'users',
     'telegram_id',
     {
       type: Sequelize.STRING,
       allowNull: true,
     }
   ).then(()=>{
     return queryInterface.addColumn(
      'users',
      'send_notifications',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
     )
   });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users', // name of Source model
      'telegram_id' // key we want to remove
    ).then(() => {
        // remove Payment hasOne Order
        return queryInterface.removeColumn(
          'users', // name of the Target model
          'send_notifications', // key we want to remove
        );
      });
  }
};
