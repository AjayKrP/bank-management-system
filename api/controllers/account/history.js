module.exports = {


  friendlyName: 'History',


  description: 'History account.',


  inputs: {},


  exits: {
    success: {
      status: 200,
      description: 'History found!'
    },
    error: {
      description: 'Error! While getting history'
    }
  },


  fn: async function (inputs, exits) {
    let me = this.req.session.me;
    await AccountInfo.isAccountExist(me, async (err, acc) => {
      console.log(acc);
      if (err) {
        return exits.error({
          message: 'Something went wrong'
        });
      }
      if (!acc) {
        return exits.error({
          message: 'No Account found for this User'
        });
      }
      console.log(acc.id);
      let history = await History.find({account: acc.id});
      console.log(history);
      let email = {
        to: me.email,
        subject: 'Account History!',
        template: 'history',
        context: {
          name: me.fullName,
          history: history
        },
      };
      HistoryService.history.addEmailToQueue({email: email, url: ''});
      //await sails.helpers.sendMail(email);
      //EmailService.sendMail({email: email});
      return exits.success({
        message: 'Your account history has been sent'
      });
    });

  }


};
