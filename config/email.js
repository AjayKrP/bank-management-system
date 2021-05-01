module.exports.email = {
  service: 'SendGrid',
  auth: {
    user: sails.locals.SENDGRID_USERNAME,
    pass: sails.locals.SENDGRID_PASSWORD
  },
  templateDir: 'views/emailTemplates',
  from: sails.locals.SENDGRID_AUTHORIZED_MAIL,
  testMode: true,
  ssl: false
};
