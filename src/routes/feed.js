const KoaRouter = require('koa-router');

const router = new KoaRouter();

/*
  const recipesList = await ctx.orm.Recipe.findAll();
  const recipesWithComments = [];
  for(let i = 0; i< recipesList.length; i++){
  	const actualUser = await recipesList[i].getOwner();
  	const actualRecipe = {
  		recipe: recipesList[i],
  	  owner: {
  	  	username: actualUser.username,
  	  	id: actualUser.id,
  	  },
	    commentsArray: loadCommentsInfo(ctx, loadRecipeComments(ctx, recipeId)),
  	};
  	recipesWithComments.push(actualRecipe);
  };
*/

/*
async function loadRecipeComments(ctx, id) {
  return await ctx.orm.Recipe.getRecipeComments(id);
}

async function loadCommentsInfo(ctx, commentsList) {
  for(let i = 0; i < commentsList.length; i++){
    const commentUser = await commentsList[i].getAuthor();
    const actualComment = {
      userId: commentUser.id,
      userName: commentUser.username,
      createdAt: ctx.state.loadedComments[i].createdAt
      content: ctx.state.loadedComments[i].content
    };
    commentsList.push(actualComment)
  };
  return commentsList;
};
*/

/*router.get('feed.list', '/feed', async (ctx) => {
  const recipesList = await ctx.orm.Recipe.findAll();
  const feedRecipesList = [];
  for(let i = 0; i< recipesList.length; i++){
  	const actualRecipe = recipesList[i];
  	const user = await actualRecipe.getAuthor();
  	feedRecipesList.push({
  		username: user.username, 
  		userId: user.id, 
  		recipeName: actualRecipe.name,
  		recipeDescription: actualRecipe.description,
  	});
  };
  await ctx.render('feed/list', {
    feedRecipesList,
  });
});
module.exports = router;
*/


router.get('feed.list', '/feed', async (ctx) => {
  const recipesList = await ctx.orm.Recipe.findAll();
  await ctx.render('feed/list', {
    recipesList,
  });
});
module.exports = router;