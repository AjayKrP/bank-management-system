module.exports = {
  sendWelcomeMail: function (obj) {
    console.log(obj);
    sails.hooks.email.send(
      obj.email.template,
      {
        context: obj.email.context
      },
      {
        to: obj.email.to,
        subject: obj.email.subject
      },
      function (err) {
        if (err) {
          console.log('Email not  send successfully-', err);
        } else {
          console.log('Email send successfully');
        }
      }
    );
  }
};
