const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;


const router = new KoaRouter();

function getIds(list){
  ids = [];
  list.forEach((elem)=>{
    ids.push(elem.id)
  })
  return ids;
}

function haveSome(ingredientList, ingredientsTarget){
  for(var i=0; i<ingredientList.length; i++) {
    if(ingredientsTarget.includes(ingredientList[i])) {
      return true;
    }
  }
  return false;
}
//curl -d "search_query=pi" -X POST http://localhost:3000/api/search

router.post('api.auth', '/', async (ctx) => {
  const { search_query } = ctx.request.body;
  const ingredients_query = search_query.split(",")
  var potential_ingredients = []
  //primero busco los ingrediente que tienen como substring el query dentro del nombre
  //y los agrego a una lista de potenciales ingredientes
  for(var i = 0; i < ingredients_query.length; i++) {
    const ingredient = ingredients_query[i];
    const ingredients =  await ctx.orm.ingredient.findAll({where:
                                                            {name:
                                                              {$iLike: "%" +ingredient.trim() +"%" }
                                                            }
                                                          });
    if (ingredients){
      potential_ingredients =  potential_ingredients.concat(ingredients);
    }
  }
  const potential_ingredients_ids = getIds(potential_ingredients);
  //luego busco las recetas que tengan al menos uno de los ingredientes

  var potential_recipes = [];
  const recipes = await ctx.orm.Recipe.findAll()
  for(var ii=0; ii<recipes.length ; ii++) {
    const ingredientList = await recipes[ii].getIngredientsList();
    if (haveSome(getIds(ingredientList), potential_ingredients_ids)) {
      potential_recipes = potential_recipes.concat(recipes[ii]);
    }
  }

  if (potential_recipes){
    ctx.body = ctx.jsonSerializer('recipes', {
    attributes: ['name', 'calories', 'description'],
    dataLinks: {
      self: (dataset, course) =>  `${ctx.origin}${ctx.router.url('recipes.view', {id: course.id})}`,
    }
  }).serialize(potential_recipes);
  }
  else {
    "No recipes Found"
  }
});

module.exports = router;
