module.exports = {
  sendWelcomeMail: function (obj) {
    sails.hooks.email.send(
      'welcomeEmail',
      {
        Name: 'Hi Dear',
        //accessToken:obj.accessToken
      },
      {
        to: obj.email,
        subject: 'Welcome Email'
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
