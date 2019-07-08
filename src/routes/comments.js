const KoaRouter = require('koa-router');
const router = new KoaRouter();
const telegramApi = require('./telegram')


// Instanciating new comment
router.get('comments.new', '/new/:id', async (ctx) => {
  const comment = ctx.orm.comment.build();
  await ctx.render('comments/new', {
    comment,
    submitCommentPath: ctx.router.url('comments.create', { id: ctx.params.id }),
  });
});

router.post('comments.create', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.create(ctx.request.body);
  const recipeId = ctx.params.id;
  // NOTIFICACION

  // Buscamos al creador de la receta
  const recipe = await ctx.orm.Recipe.findById(recipeId);
  let CreatorId = recipe.dataValues.userId;
  if (!CreatorId){
    CreatorId = 1;
  }
  const creator = await ctx.orm.user.findById(CreatorId);

  // Creamos la notificación para el creador
  const notification = await ctx.orm.Notifications.create({
    contents: 'Nuevo comentario en una receta que Creaste!',
    link: ctx.router.url('recipes.view', { id: recipeId }),
    checked: false,
  });

  // La agregamos al creador de la receta
  await creator.addNotification(notification);
  // También le mandaremos una notificación por telegram en caso de que las tenga activadas
  const telegramEnabled = await creator.send_notifications;
  if (telegramEnabled){
    const fullUrl = ctx.origin + ctx.router.url('recipes.view', { id: recipeId });
    const chatid = await creator.telegram_chat_id;
    const notificationToSend = `Nuevo comentario en una receta que creaste! ${fullUrl}`;
    telegramApi.SendMessage(chatid, notificationToSend);
  }

  // Ahora buscamos a todos los que tienen la receta en favoritos
  // Y agregamos la notificacion a cada uno de ellos.
  const favorited = await recipe.getUserfollowers();
  if (favorited.length != 0) {
    // Creamos la notificación para los que le dieron favorito
    const notification2 = await ctx.orm.Notifications.create({
      contents: 'Nuevo comentario en una receta que tienes en favoritos!',
      link: ctx.router.url('recipes.view', { id: recipeId }),
      checked: false,
    });
    favorited.forEach(async (user) => {
      await user.addNotification(notification2);

      const telegramEnabled2 = await user.send_notifications;
      if (telegramEnabled2){
        const fullUrl = ctx.origin + ctx.router.url('recipes.view', { id: recipeId });
        const chatid = await user.telegram_chat_id;
        const notificationToSend = `Nuevo comentario en una receta que tienes en favoritos! ${fullUrl}`;
        telegramApi.SendMessage(chatid, notificationToSend);
      }
    });
  }

  // Podemos obtener las notificaciones de un usuario con:
  /*
  const exuser = await ctx.orm.user.findById(2);
  console.log(await exuser.getNotifications());
  */

  try {
    await comment.save({ fields: ['content'] });
    await ctx.state.currentUser.addComments(comment);
    const recipe = await ctx.orm.Recipe.findById(recipeId);
    // await recipe.addRecipeComments(comment).then(()=> console.log('nuevo comentario'));
    await recipe.addRecipeComments(comment);
    ctx.redirect(ctx.router.url('recipes.view', { id: recipeId }));
  } catch (validationError) {
    await ctx.render('comments/new', {
      comment,
      errors: validationError.errors,
      submitCommentPath: ctx.router.url('comments.create'),
    });
  }
});

router.del('comments.delete', '/:recipeId/:id', async (ctx) => {
  // console.log('\n------------- *** ------------\n');
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  // console.log('\n------------- *** ------------\n');
  await comment.destroy();
  ctx.redirect(ctx.router.url('recipes.view', { id: ctx.params.recipeId }));
});


module.exports = router;
