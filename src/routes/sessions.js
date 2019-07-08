const KoaRouter = require('koa-router');
const uuidv1 = require('uuid/v1');

const router = new KoaRouter();

router.get('sessionNew', '/new', async ctx =>
  ctx.render('sessions/new', {
    createSessionPath: ctx.router.url('sessionCreate'),
    notice: ctx.flashMessage.notice,
  }),
);

router.put('sessionCreate', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.find({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    const sessionId = uuidv1();
    await user.update({sessionId:sessionId});
    ctx.session.sessionId = sessionId;
    return ctx.redirect(ctx.router.url('index.initial'));
  }
  return ctx.render('sessions/new', {
    email,
    createSessionPath: ctx.router.url('sessionCreate'),
    error: 'e-mail o contraseña incorrectos',
  });
});

router.delete('sessionDestroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('sessionNew'));
});

module.exports = router;
