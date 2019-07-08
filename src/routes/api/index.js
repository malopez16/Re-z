const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const ingredientsApi = require('./ingredients');
const authApi = require('./auth');
const recipeApi = require('./recipes');
const searchApi = require('./search')

const router = new KoaRouter();

router.use('/ingredients', ingredientsApi.routes());
router.use('/auth', authApi.routes());
router.use('/search', searchApi.routes());

// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findById(ctx.state.authData.userId);
  }
  return next();
});

router.use('/recipes', recipeApi.routes());



module.exports = router;
