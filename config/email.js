module.exports.email = {
  service: 'Gmail',
  auth: {
    user: '<your email>',
    pass: '<your email app password>'
  },
  templateDir: 'views/emailTemplates',
  from: '<your mail>',
  testMode: false,
  ssl: false
};
