const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

const default_img_url = "https://res.cloudinary.com/dvg4w5gnb/image/upload/v1558558269/kisspng-computer-icons-plate-nutrition-out-of-home-adverti-plates-5abdf40a7b6504.4712833715223982185054_f161cs.jpg"


router.get('index.initial', '/', async (ctx) => {
  const recipesList = await ctx.orm.Recipe.findAll({
    order: [
      ['updatedAt', 'DESC'],
    ],
    limit: 3,
  });
  await ctx.render('feed/list', {
    default_img_url,
    recipesList,
    appVersion: pkg.version,
    searchPath: ctx.router.url('view.search'),
    ingredientPath: ctx.router.url('ingredients.list'),
    recipePath: ctx.router.url('recipes.list'),
    userPath: ctx.router.url('users.new'),
    viewRecipePath: recipe => ctx.router.url('recipes.view', { id: recipe.id }),
  });
});

module.exports = router;
