const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  if (ctx.state.user) {
    return next();
  }
  ctx.redirect(ctx.router.url('index.initial'));
}


router.get('notifications.request', '/API', async (ctx) => {
  const user =  await ctx.orm.user.findById(ctx.state['currentUser']['id']);
  const notifications = await user.getNotifications();
  ctx.body = notifications;
});


router.post('notifications.read', '/API/read/:id', async (ctx) => {
  const { id } = ctx.params;
  const notification = await ctx.orm.Notifications.findById(id);
  await notification.update({checked: true });
  ctx.body = { checked: true };
});

module.exports = router;
