const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function protectPath(ctx, next){
  const { recipe } = ctx.state;
  const owner = await recipe.getOwner();
  if (ctx.state.logged && owner && ctx.state.currentUser.id == owner.id){
    return next()
  }
  if (ctx.state.logged && ctx.state.currentUser.admin){
    return next()
  }
  else {
    ctx.redirect(ctx.router.url("recipes.list"))
  }
}

async function loadRecipe(ctx, next) {
  ctx.state.recipe = await ctx.orm.Recipe.findById(ctx.params.id);
  if (ctx.state.recipe){
      return next();
  }
  ctx.redirect(ctx.router.url("recipes.list"))
}

function getTotalCalories(ingredients) {
  const totalcalories = ingredients.reduce((previus, current) => {
    return previus + parseInt(current.calories, 10);
  }, 0);
  if (isNaN(totalcalories)) {
    return 0;
  }
  return totalcalories;
}

router.get('recipes.list', '/', async (ctx) => {
  const recipesList = await ctx.orm.Recipe.findAll();
  const owners = {};
  for(let i = 0; i< recipesList.length; i++){
    const owner = await recipesList[i].getOwner();
    const recipeId = recipesList[i].id
    owners[recipeId] = owner;
  }
  await ctx.render('recipes/index', {
    recipesList,
    owners: owners,
    newRecipePath: ctx.router.url('recipes.new'),
    viewRecipePath: recipe => ctx.router.url('recipes.view', { id: recipe.id }),
    IndexPath: ctx.router.url('index.initial'),
  });
});

router.get('recipes.newstep', '/:id/addstep',  loadRecipe, protectPath, async (ctx) => {
  const { recipe } = ctx.state;
  const step = ctx.orm.Steps.build();
  await ctx.render('recipes/newstep', {
    recipe,
    step,
    submitRecipeStepPath: ctx.router.url('recipes.createstep', { id: recipe.id }),
  });
});

router.post('recipes.createstep', '/:id/addstep', loadRecipe, protectPath, async (ctx) => {
  const { recipe } = ctx.state;
  const step = ctx.orm.Steps.build(ctx.request.body);
  const {img_file} = ctx.request.files;
  if (img_file.name){
    let img_url;
    let img_key;
    await ctx.state.cloudinary.uploader.upload(img_file.path , function(error, result) {
      console.log(result, error)
      img_url = result.url
      img_key = result.public_id
    });
    step.img_key = img_key;
    step.img_url = img_url;
    await step.save({ fields: ['name', 'position', 'description', 'img_key', 'img_url'] })
  }
  else {
      await step.save({ fields: ['name', 'position', 'description'] });
  }
  await recipe.addRecipeSteps(step);
  ctx.redirect(ctx.router.url('recipes.view', { id: recipe.id }));
});

// Instanciating new recipe
router.get('recipes.new', '/new', async (ctx) => {
  const recipe = ctx.orm.Recipe.build();
  await ctx.render('recipes/new', {
    recipe,
    submitRecipePath: ctx.router.url('recipes.create'),
  });
});

router.post('recipes.create', '/', async (ctx) => {
  const recipe = await ctx.orm.Recipe.create(ctx.request.body);
  try {
    const {img_file} = ctx.request.files;
    if (img_file.name){
      let img_url;
      let img_key;
      await ctx.state.cloudinary.uploader.upload(img_file.path , function(error, result) {
        console.log(result, error)
        img_url = result.url
        img_key = result.public_id
      });
      recipe.img_key = img_key;
      recipe.img_url = img_url;
      await recipe.save({ fields: ['name', 'calories', 'description', 'img_key', 'img_url'] })
    }
    else {
        await recipe.save({ fields: ['name', 'calories', 'description'] });
    }
    await ctx.state.currentUser.addUserRecipes(recipe);
    ctx.redirect(ctx.router.url('recipes.list'));
  } catch (validationError) {
    await ctx.render('recipes/new', {
      recipe,
      errors: validationError.errors,
      submitRecipePath: ctx.router.url('recipes.create'),
    });
  }
});


// with the relationship in the models we can acces de ingrediets of the recepi
router.get('recipes.view', '/:id', loadRecipe, async (ctx) => {
  const { recipe } = ctx.state;
  const ingredients = await recipe.getIngredientsList();
  const owner = await recipe.getOwner();
  const comments = await recipe.getRecipeComments();
  const commentsList = [];

  comments.forEach(async (comment) => {
    const actualComment = {};
    actualComment.author = await comment.getAuthor();
    actualComment.content = comment.content;
    actualComment.date = comment.createdAt.toISOString().substring(0, 10);
    actualComment.id = comment.id
    commentsList.push(actualComment);
  });
  // const stepsList = await recipe.getRecipeSteps();
  const stepsList = await recipe.getRecipeSteps({});
  let stepid;
  if(stepsList.length == 0){
    stepid = 0
  } else{
    stepid = stepsList[0].id
  }
  await recipe.update({ calories: getTotalCalories(ingredients) });
  permission = ctx.state.logged && owner && ctx.state.currentUser.id == owner.id;
  permission = permission || (ctx.state.logged &&  ctx.state.currentUser.admin)
  let is_favorite = false
  if (ctx.state.logged){
    const favorites = await ctx.state.currentUser.getFavorites()
    for (let i = 0; i < favorites.length ; i++){
      if (favorites[i].id == recipe.id){
        is_favorite = true
      }
    }
  }
  let favorites_count = 0
  const follower_users = await recipe.getUserfollowers();
  if (follower_users) {
    favorites_count += follower_users.length;
  }

  const default_img_url = "https://res.cloudinary.com/dvg4w5gnb/image/upload/v1558558269/kisspng-computer-icons-plate-nutrition-out-of-home-adverti-plates-5abdf40a7b6504.4712833715223982185054_f161cs.jpg"

  await ctx.render('recipes/view', {
    recipe,
    stepsList,
    ingredients,
    commentsList,
    permission,
    is_favorite,
    favorites_count,
    default_img_url,
    recipePath: ctx.router.url('recipes.list'),
    viewRecipeStepPath: (recipe, step) => ctx.router.url('steps.view', {id: recipe.id, step: step.id }),
    submitRecipeIngredientPath: ctx.router.url('recipes.newingredient', { id: recipe.id }),
    deleteRecipeStepPath: (recipe, step) => ctx.router.url('recipes.deletestep', { id: recipe.id, step: step.id }),
    editRecipeStepPath: (recipe, step) => ctx.router.url('recipesteps.edit', { id: recipe.id, step: step.id }),
    removeingredientPath: (recipe, ingredient) => ctx.router.url('recipe.removeingredient', {id: recipe.id, ingredientId: ingredient.id}),
    newStepPath: ctx.router.url('recipes.newstep', { id: recipe.id }),
    BrowseStepsPath: ctx.router.url('steps.view', { id: recipe.id, step: stepid }),
    addAsFavotirePath: ctx.router.url('recipes.addFavorite', {id: recipe.id}),
    removeFavoritePath: ctx.router.url('recipes.removeFavorite', {id: recipe.id}),
    addCommentPath: ctx.router.url('comments.new', {id: recipe.id}),
    deleteCommentPath: (recipeId, commentId) => ctx.router.url('comments.delete', {recipeId: recipeId, id: commentId}),
  });
});


// Just like creating a new recipe, we handle the editing by having one router set to show the form, an another router to do the request.
router.get('recipes.edit', '/:id/edit', loadRecipe, protectPath, async (ctx) => {
  // https://stackoverflow.com/a/25188048
  // {x, y} = foo; is the equivalent to x = foo.x; y = foo.y;
  // Therefore, recipe = ctx.state.recipe, which was set by callback function loadRecipe.
  const { recipe } = ctx.state;
  await ctx.render('recipes/edit', {
    recipe,
    submitRecipePath: ctx.router.url('recipes.update', { id: recipe.id }),
  });
});


// Here we handle the request to update.
router.patch('recipes.update', '/:id', loadRecipe, protectPath, async (ctx) => {
  const { recipe } = ctx.state;
  try {
    const { name, calories, description} = ctx.request.body;
    const {img_file} = ctx.request.files;
    if (img_file.name){
      let img_url;
      let img_key;
      await ctx.state.cloudinary.uploader.upload(img_file.path , function(error, result) {
        console.log(result, error)
        img_url = result.url
        img_key = result.public_id
      });
      if (recipe.img_url) {
        await ctx.state.cloudinary.uploader.destroy(recipe.img_key, function(error, result) {
          console.log(result, error);
        })
      }
      await recipe.update({ name, calories, description, img_key, img_url });
    }
    else {
        await recipe.update({ name, calories, description });
    }

    ctx.redirect(ctx.router.url('users.view', {id: ctx.state.currentUser.id}));
  } catch (validationError) {
    console.log(validationError)
    // Si tenemos un error de validacion, cargaremos la misma pagina de vuelta.
    await ctx.render('recipes/edit', {
      recipe,
      errors: validationError.errors,
      submitRecipePath: ctx.router.url('recipes.update', {id: recipe.id}),
    });
  }
});

router.del('recipes.delete', '/:id', loadRecipe, protectPath, async (ctx) => {
  const { recipe } = ctx.state;
  await recipe.destroy();
  ctx.redirect(ctx.router.url('recipes.list'));
});

router.get('recipes.newingredient', '/:id/addingredient', loadRecipe, protectPath, async (ctx) => {
  const { recipe } = ctx.state;
  const ingredient = ctx.orm.ingredient.build();
  await ctx.render('recipes/newingredient', {
    recipe,
    ingredient,
    submitRecipeIngredientPath: ctx.router.url('recipes.createingredient', { id: recipe.id }),
  });
});


router.post('recipes.createingredient', '/:id/addingredient', loadRecipe, protectPath, async (ctx) => {
  const { recipe } = ctx.state;
  const ingredient = ctx.orm.ingredient.build(ctx.request.body);
  await ingredient.save({ fields: ['name', 'calories'] });
  try {
    await recipe.addIngredientsList(ingredient);
    await ctx.state.currentUser.addUserIngredients(ingredient);
    ctx.redirect(ctx.router.url('recipes.view', { id: recipe.id }));
  } catch (validationError) {
    await ctx.render('recipes/newingredient', {
      validationError,
      recipe,
      ingredient,
      submitRecipeIngredientPath: ctx.router.url('recipes.createingredient', { id: recipe.id }),
    });
  }
});

router.del('recipe.removeingredient', '/:id/removeingredient/:ingredientId', loadRecipe, protectPath, async (ctx) => {
  const { recipe } = ctx.state;
  const ingredient = await ctx.orm.ingredient.findById(ctx.params.ingredientId);
  await recipe.removeIngredientsList(ingredient);
  ctx.redirect(ctx.router.url('recipes.view', {id: recipe.id}));
});


router.get('recipesteps.edit', '/:id/:step/edit', loadRecipe, protectPath, async (ctx) => {
  const step = await ctx.orm.Steps.findById(ctx.params.step);
  const { recipe } = ctx.state;
  await ctx.render('recipes/stepsedit', {
    step,
    submitRecipeStepPath: (recipe, step) => ctx.router.url('recipesteps.update', { id: recipe.id, step: step.id }),
  });
});

router.patch('recipesteps.update', '/:id/:step/edit', loadRecipe, protectPath, async (ctx) => {
  const step = await ctx.orm.Steps.findById(ctx.params.step);
  const { recipe } = ctx.state;
  const { name, position, description } = ctx.request.body;
  const {img_file} = ctx.request.files;
  if (img_file.name){
    let img_url;
    let img_key;
    await ctx.state.cloudinary.uploader.upload(img_file.path , function(error, result) {
      console.log(result, error)
      img_url = result.url
      img_key = result.public_id
    });
    if (step.img_url) {
      await ctx.state.cloudinary.uploader.destroy(step.img_key, function(error, result) {
        console.log(result, error);
      })
    }
    await step.update({ name, position, description, img_key, img_url });
  }
  else {
      await step.update({ name, position, description });
  }

  ctx.redirect(ctx.router.url('recipes.view', { id: recipe.id }));
});


router.del('recipes.deletestep', ':id/:step/deletestep', loadRecipe, protectPath, async (ctx) => {
  const step = await ctx.orm.Steps.findById(ctx.params.step);
  await step.destroy();
  ctx.redirect(ctx.router.url('recipes.view', { id: ctx.params.id }));
});

router.post('recipes.addFavorite', '/:id/addfavorite', loadRecipe, async (ctx) => {
  const { recipe } = ctx.state;
  if (ctx.state.logged){
    ctx.state.currentUser.addFavorites(recipe);
    ctx.redirect(ctx.router.url('recipes.view', {id: recipe.id}));
  }
});


router.del('recipes.removeFavorite', '/:id/removeFavorite', loadRecipe, async (ctx) => {
  const { recipe } = ctx.state;
  if (ctx.state.logged){
    ctx.state.currentUser.removeFavorites(recipe);
    ctx.redirect(ctx.router.url('recipes.view', {id: recipe.id}));
  }
});

module.exports = router;
