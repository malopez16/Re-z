const KoaRouter = require('koa-router');

const Sequelize = require('sequelize');

const router = new KoaRouter();

async function loadRecipe(ctx, next) {
  ctx.state.recipe = await ctx.orm.Recipe.findById(ctx.params.id);
  if (ctx.state.recipe){
    return next();
  }
  ctx.redirect(ctx.router.url("recipes.list"))
}

async function loadStep(ctx, next) {
  ctx.state.step = await ctx.orm.Steps.findById(ctx.params.step);
  const steps = await ctx.state.recipe.getRecipeSteps()
  if (ctx.state.step ){
      for(let i = 0; i < steps.length  ;i++){
        if (ctx.state.step.id == steps[i].id){
          return next();
        }
      }
  }
  ctx.redirect(ctx.router.url("recipes.view", {id: ctx.state.recipe.id}))
}


const {gt, lt, ne, in: opIn} = Sequelize.Op;

// with the relationship in the models we can acces de ingrediets of the recepi
router.get('steps.view', '/:id/:step/', loadRecipe, loadStep, async (ctx) => {
  const { recipe } = ctx.state;
  const { step } = ctx.state;
  const owner = await recipe.getOwner();
  permission = ctx.state.logged && owner && ctx.state.currentUser.id == owner.id;
  permission = permission || (ctx.state.logged &&  ctx.state.currentUser.admin);
  let stepid;
  let nextstep = await recipe.getRecipeSteps({
    limit:1,
    where:{
      createdAt:{
        [gt]: step.createdAt,
      },
    },
  });
  let previousstep = await recipe.getRecipeSteps({
    limit: 1,
    where: {
      createdAt: {
        [lt]: step.createdAt,
      },
    },
  });
  let theresnext = 0;
  let theresprevious = 0;
  if (nextstep.length > 0) {
    theresnext = 1;
  } else {
    nextstep = [
      {
        id: 0,
      },
    ];
  }
  if (previousstep.length > 0) {
    theresprevious = 1;
  } else {
    previousstep = [
      { id: 0 },
    ];
  }
  const default_img_url = "https://res.cloudinary.com/dvg4w5gnb/image/upload/v1559522089/45575_vlohj0.svg";
  await ctx.render('steps/view', {
    permission,
    default_img_url,
    theresnext,
    theresprevious,
    previousstep,
    recipe,
    step,
    stepid,
    NextStepPath: ctx.router.url('steps.view', { id: recipe.id, step: nextstep[0].id }),
    PreviousStepPath: ctx.router.url('steps.view', { id: recipe.id, step: previousstep[0].id }),
    editRecipeStepPath: (recipe, step) => ctx.router.url('recipesteps.edit', { id: recipe.id, step: step.id }),
    viewRecipePath: recipe => ctx.router.url('recipes.view', { id: recipe.id }),
  });
});


module.exports = router;
