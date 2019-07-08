const KoaRouter = require('koa-router');

const router = new KoaRouter();

const CreateAccountEmail = require('../mailers/create-account');
const telegramApi = require('./telegram')

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  if (ctx.state.user) {
    return next();
  }
  ctx.redirect(ctx.router.url('index.initial'));
}

async function onlyadmin(ctx, next) {
  if (ctx.state.logged && ctx.state.currentUser.admin) {
    return next();
  }
  ctx.redirect(ctx.router.url('index.initial'));
}

async function protectPath(ctx, next) {
  const { user } = ctx.state;
  if (ctx.state.logged && ctx.state.currentUser.id == user.id) {
    return next();
  }
  if (ctx.state.logged && ctx.state.currentUser.admin) {
    return next();
  }
  ctx.redirect(ctx.router.url('index.initial'));
}

async function validatepassword(ctx, next) {
  const passwordlen = ctx.request.body.password.length;
  if (passwordlen < 6) {
    ctx.redirect(ctx.router.url('users.new'));
  } else {
    return next();
  }
}

router.get('users.list', '/', onlyadmin, async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
  });
});


router.get('users.view', '/:id/show', loadUser, async (ctx) => {
  const { user } = ctx.state;
  let permission = ctx.state.logged && ctx.state.currentUser.id == user.id;
  permission = permission || ctx.state.logged && ctx.state.currentUser.admin;
  const favorites = await user.getFavorites();
  const OwnedRecipes = await user.getUserRecipes();
  const TelegramNotifications = await user.send_notifications ? 'Activadas' : 'Desactivadas';
  await ctx.render('users/view', {
    user,
    favorites,
    OwnedRecipes,
    permission,
    newRecipePath: ctx.router.url('recipes.new'),
    RecipePath: recipe => ctx.router.url('recipes.view', { id: recipe.id }),
    editRecipePath: recipe => ctx.router.url('recipes.edit', { id: recipe.id }),
    deleteRecipePath: recipe => ctx.router.url('recipes.delete', { id: recipe.id }),
    listRecipePath: ctx.router.url('recipes.list'),
    telegram_state: TelegramNotifications,
    changeTelegramUsername: ctx.router.url('users.telegramuser', { id: user.id }),
    changeTelegramStatus: ctx.router.url('users.telegram', { id: user.id }),
  });
});

router.post('users.telegramuser', '/telegramuser/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const { telegramname } = ctx.request.body;
  await user.update({
    telegram_id: telegramname,
  });
  const chatid = await telegramApi.GetChatId(user.telegram_id);
  if (chatid){  
    await user.update({
    telegram_chat_id: chatid,
  });
  }

  //console.log("Telegram ID:");
  //console.log(await user.telegram_id);
  //console.log("Chat ID:");
  const chatid2 = await user.telegram_chat_id;
  //console.log(chatid2);
  //telegramApi.SendMessage(chatid2, "Holita");
  await ctx.redirect(ctx.router.url('users.view', { id: user.id }));
});

router.post('users.telegram', '/telegram/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const NotificationsOn = await user.send_notifications;
  if (NotificationsOn) {
    await user.update({
      send_notifications: false,
    });
  } else {
    await user.update({
      send_notifications: true,
    });
  }
  await ctx.redirect(ctx.router.url('users.view', { id: user.id }));
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.get('users.edit', '/:id/edit', loadUser, protectPath, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
  });
});

router.post('users.create', '/', validatepassword, async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  if (ctx.request.body.password.length < 6) {
    await ctx.render('users/new', {
      user,
      errors: ['Contraseña muy corta. Mínimo 6 carácteres.'],
      submitUserPath: ctx.router.url('users.create'),
    });
  }
  try {
    await user.save({ fields: ['username', 'first_name', 'last_name', 'password', 'email'] });
    await CreateAccountEmail(ctx, { user });
    ctx.redirect(ctx.router.url('sessionNew'));
  } catch (validationError) {
    user.password = ctx.request.body.password;
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.patch('users.update', '/:id', loadUser, protectPath, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {
      username, first_name, last_name, email, password,
    } = ctx.request.body;
    await user.update({
      username, password, first_name, last_name, email,
    });
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update'),
    });
  }
});

router.del('users.delete', '/:id', loadUser, protectPath, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

module.exports = router;
