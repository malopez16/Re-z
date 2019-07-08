const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.ingrediets.list', '/', async (ctx) => {
  const ingredientsList = await ctx.orm.ingredient.findAll();
  ctx.body = ctx.jsonSerializer('ingredient', {
    attributes: ['name', 'calories'],
  }).serialize(ingredientsList);
});


router.get('api.ingrediets.list', '/:recipeid', async (ctx) => {
  const recipe = await ctx.orm.Recipe.findById(ctx.params.recipeid);
  const ingredientsList = await recipe.getIngredientsList();
  ctx.body = ctx.jsonSerializer('ingredient', {
    attributes: ['name', 'calories'],
  }).serialize(ingredientsList);
});


module.exports = router;
