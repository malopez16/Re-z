const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();


//curl -d "email=fipaniagua@uc.cl&password=asdzxc" -X POST http://localhost:3000/api/auth

router.post('api.auth', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.find({ where: { email } });
  if (user && await user.checkPassword(password)) {
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
      );
    });
    ctx.body = { token };
  } else {
    ctx.throw(401, 'Wrong e-mail or password');
  }
});

module.exports = router;
