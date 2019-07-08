const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function onlyadmin(ctx, next){
  if (ctx.state.logged && ctx.state.currentUser.admin){
    return next();
  }
  ctx.redirect(ctx.router.url('index.initial'))
}

async function loadIngredient(ctx, next) {
  ctx.state.ingredient = await ctx.orm.ingredient.findById(ctx.params.id);
  if(ctx.state.ingredient){
      return next();
  }
  ctx.redirect(ctx.router.url("ingredients.list"))
}

async function protectPath(ctx, next){
  console.log("y paso por aqui tambien")
  const { ingredient } = ctx.state;
  const owner = await ingredient.getOwner();
  if (ctx.state.logged && owner && ctx.state.currentUser.id == owner.id){
    return next()
  }
  if (ctx.state.logged && ctx.state.currentUser.admin){
    return next()
  }
  else {
    ctx.redirect(ctx.router.url("ingredients.list"))
  }
}

router.get('ingredients.list', '/', async (ctx) => {
  const ingredientsList = await ctx.orm.ingredient.findAll();
  const owners = {};
  for(let i = 0; i< ingredientsList.length; i++){
    const owner = await ingredientsList[i].getOwner();
    owners[ingredientsList[i].id] = owner;
  }
  await ctx.render('ingredients/index', {
    ingredientsList,
    owners,
    newIngredientPath: ctx.router.url('ingredients.new'),
    editIngredientPath: ingredient=>ctx.router.url('ingredients.edit', {id : ingredient.id}),
    deleteIngredientPath: ingredient=>ctx.router.url('ingredients.delete', {id : ingredient.id}),
  });
});


// Instanciating new recipe
router.get('ingredients.new', '/new', async (ctx) => {
    const ingredient = ctx.orm.ingredient.build();
    await ctx.render('ingredients/new', {
      ingredient,
      submitIngredientPath: ctx.router.url('ingredients.create'),
    });
});


router.post('ingredients.create', '/', async (ctx) => {
  const ingredient = ctx.orm.ingredient.build(ctx.request.body);
  /*try { */
    await ingredient.save({ fields: ['name', 'calories'] });
    if (ctx.state.logged){
      await ctx.state.currentUser.addUserIngredients(ingredient)
    }
    ctx.redirect(ctx.router.url('ingredients.list'));
  /*} catch (validationError) {
    await ctx.render('ingredients/new', {
      ingredient,
      errors: validationError.errors,
      submitIngredientPath: ctx.router.url('ingredients.create'),
    });
  }*/
});

// Just like creating a new recipe, we handle the editing by having one router set to show the form, an another router to do the request.
router.get('ingredients.edit', '/:id/edit', loadIngredient, protectPath, async(ctx) =>{
  // https://stackoverflow.com/a/25188048
  // {x, y} = foo; is the equivalent to x = foo.x; y = foo.y;
  // Therefore, recipe = ctx.state.recipe, which was set by callback function loadRecipe.
  console.log("llego aqui!!!");
  const {ingredient} = ctx.state;
  await ctx.render('ingredients/edit', {
    ingredient,
    submitIngredientPath: ctx.router.url('ingredients.update', {id: ingredient.id}),
  });
});

// Here we handle the request to update.
router.patch('ingredients.update', '/:id', loadIngredient, protectPath, async(ctx) => {
  const {ingredient} = ctx.state;
  try{
    const {name, calories} = ctx.request.body;
    await ingredient.update({name, calories});
    ctx.redirect(ctx.router.url('ingredients.list'));
  } catch (validationError){
    // Si tenemos un error de validacion, cargaremos la misma pagina de vuelta.
    await ctx.render('ingredients/edit', {
      ingredient,
      errors: validationError.errors,
      submitIngredientPath : ctx.router.url('ingredients.update'),
    });
  }
});

router.del('ingredients.delete', '/:id', loadIngredient, onlyadmin, async (ctx) => {
  const { ingredient } = ctx.state;
  await ingredient.destroy();
  ctx.redirect(ctx.router.url('ingredients.list'));
});
module.exports = router;
