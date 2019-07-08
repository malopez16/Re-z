

module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const recetas = [
      {
        name: 'Spaghetti con albahaca',
        calories: 200,
        description: 'Plato liviano y nutritivo.',
        createdAt: new Date(),
        updatedAt: new Date(),
        img_url: 'https://res.cloudinary.com/dajm9fvtd/image/upload/v1560482561/basil-blur-cuisine-769969_gr9oe6.jpg',
      },
      {
        name: 'Pastel de carne',
        calories: 250,
        description: 'Simple y rápido.',
        createdAt: new Date(),
        updatedAt: new Date(),
        img_url: 'https://res.cloudinary.com/dajm9fvtd/image/upload/v1560483138/628266_xahnr2.jpg',
      },
      {
        name: 'Cheesecake de frambuesa',
        calories: 300,
        description: '¡Exquisito!',
        createdAt: new Date(),
        updatedAt: new Date(),
        img_url: 'https://res.cloudinary.com/dajm9fvtd/image/upload/v1560483282/raspberry-cheesecake-with-grand-marnier.ashx_lx2ts4.jpg',
      },
    ];
    return queryInterface.bulkInsert('Recipes', recetas);
  },
  down: queryInterface => queryInterface.bulkDelete('Recipes', null, {})
  ,
};
