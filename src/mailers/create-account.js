module.exports = function CreateAccountEmail(ctx, { user }) {
    return ctx.sendMail('create-account-email', { to: user.email, subject: 'Nueva Creación de cuenta', from: 'reztitateam <malopez16@uc.cl>'}, { user });
  };
  