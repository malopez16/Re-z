const KoaRouter = require('koa-router');
const ejsLint = require('ejs-lint');

var cloudinary = require('cloudinary').v2;
var api_config = require('./config/storage')

const search = require('./routes/search')
const hello = require('./routes/hello');
const index = require('./routes/index');
const recipes = require('./routes/recipes');
const users = require('./routes/users');
const sessions = require('./routes/sessions');
const ingredients = require('./routes/ingredients');
const steps = require('./routes/steps');
const comments = require('./routes/comments');
const notifications = require('./routes/notifications');
const api = require('./routes/api');

cloudinary.config(api_config);

const router = new KoaRouter();
router.use(async (ctx, next) => {


  const user = ctx.session.sessionId && await ctx.orm.user.find({ where: { sessionId: ctx.session.sessionId } });;
  if (user){
    var logged = true;
  }
  else {
    var logged = false;
  }
  Object.assign(ctx.state, {
    cloudinary,
    currentUser: user,
    logged: logged,
    newSessionPath: ctx.router.url('sessionNew'),
    destroySessionPath: ctx.router.url('sessionDestroy'),
    newUserPath: ctx.router.url('users.new'),
    IndexPath: ctx.router.url('index.initial'),
    searchPath: ctx.router.url('view.search'),
    UserPath: user => ctx.router.url('users.view', {id: user.id}),
  });
  return next();
});

router.use('', index.routes());
router.use('/hello', hello.routes());
router.use('/recipes', recipes.routes());
router.use('/users', users.routes());
router.use('/ingredients', ingredients.routes());
router.use('/steps', steps.routes());
router.use('/sessions', sessions.routes());
router.use('/comments', comments.routes());
router.use('/notifications', notifications.routes());
router.use('/search', search.routes());
router.use('/api', api.routes());
module.exports = router;
