const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadRecipe(ctx, next){
  ctx.state.recipe = await ctx.orm.Recipe.findById(ctx.params.recipeid);
  return next();
}


async function protectPath(ctx, next){
  const {recipe} = ctx.state;
  const currentUser = ctx.state.currentUser;
  ctx.state.owner = await recipe.getOwner();
  if(currentUser && ((ctx.state.owner && ctx.state.owner.id == currentUser.id) || currentUser.admin)){
    return next();
  }
  ctx.throw(403, "this user doesn't have privilege over this recipe");
}


//curl -H "Authorization: Bearer <token>" -d "name=apiingridient&calories=201" -X POST http://localhost:3000/api/recipes/10/addingredient

router.post('api.recipes.addIngredient', '/:recipeid/addingredient', loadRecipe, protectPath, async (ctx) => {
  const {recipe , owner} = ctx.state;
  const currentUser = ctx.state.currentUser;
  const ingredient = ctx.orm.ingredient.build(ctx.request.body);
  await ingredient.save({ fields: ['name', 'calories'] });
  await recipe.addIngredientsList(ingredient);
  await currentUser.addUserIngredients(ingredient);
  ctx.body = ctx.jsonSerializer('ingredient', {
  attributes: ['name', 'calories'],
  }).serialize(ingredient);
});


//curl -H "Authorization: Bearer <token>" -X DEL http://localhost:3000/api/recipes/10/removeingredient/21
router.post('api.recipes.delIngredient', '/:recipeid/removeingredient/:ingredientid', loadRecipe, protectPath, async (ctx) => {
  const {recipe , owner} = ctx.state;
  const ingredient = await ctx.orm.ingredient.findById(ctx.params.ingredientid);
  await recipe.removeIngredientsList(ingredient);
  ctx.body = {response: 'successfully eliminated'}
})

module.exports = router;
