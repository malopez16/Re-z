'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn(
     'users',
     'telegram_chat_id',
     {
       type: Sequelize.STRING,
       allowNull: true,
     }
   )},
  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
     'users',
     'telegram_chat_id',
   )}
};
