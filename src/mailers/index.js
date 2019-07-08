const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

module.exports = function mailers(app) {
  console.log(emailConfig.data);
  emailConfig.data.auth = {
    user: process.env.SENDGRID_USER, // generated ethereal user
    pass: process.env.SENDGRID_PASS,
  }
  const transport = nodemailer.createTransport(emailConfig.data);

  // eslint-disable-next-line no-param-reassign
  app.context.sendMail = async function sendMail(emailName, options, templateContext) {
    const html = await this.render(
      `emails/${emailName}`,
      { ...templateContext, layout: false, writeResp: false },
    );
    return transport.sendMail({ ...options, html });
  };
  
};
