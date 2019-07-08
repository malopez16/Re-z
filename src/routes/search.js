const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('view.search' , '/', async (ctx) => {
  await ctx.render('search/view', {});
  })


module.exports = router;
