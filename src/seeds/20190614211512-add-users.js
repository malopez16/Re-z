

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [{
      username: 'malopez16',
      first_name: 'Mauricio',
      last_name: 'Lopez',
      email: 'malopez16@uc.cl',
      password: await bcrypt.hash('asdasd123', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      username: 'fipaniagua',
      first_name: 'Francisco',
      last_name: 'Paniagua',
      email: 'fipaniagua@uc.cl',
      password: await bcrypt.hash('asdzxc', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ];
    return queryInterface.bulkInsert('users', users);
  },
  down: queryInterface => queryInterface.bulkDelete('users', null, {})
  ,
};
