module.exports = {


  friendlyName: 'Deposit',


  description: 'Deposit account.',


  inputs: {
    amount: {
      type: 'number',
      required: true
    }
  },


  exits: {
    success: {
      status: 200,
      description: 'Total amout added'
    },
    amountError: {
      status: 508,
      description: 'Amount Should be greater than 0'
    },
    error: {
      description: 'Something went wrong'
    }
  },


  fn: async function (inputs, exits) {
    if (inputs.amount <= 0.0) {
      return exits.amountError({
        message: 'Amount should be greater than 0'
      });
    }
    let current = await AccountInfo.findOne({user: this.req.session.me.id});
    if (!current) {
      return exits.error({
        message: 'Error! while adding!'
      });
    }
    let amountUpdated = await AccountInfo.updateOne({user: this.req.session.me.id}).set({balance: inputs.amount + current.balance});
    const email = {
      to: this.req.session.me.email,
      subject: 'Account Credit!',
      template: 'deposit',
      context: {
        name: this.req.session.me.fullName,
        debitAmount: inputs.amount,
        currentAmount: amountUpdated.balance
      },
    };
    //await sails.helpers.sendMail(email);
    EmailService.sendWelcomeMail({email: email});
    if (amountUpdated) {
      return exits.success({
        message: 'Amount successfully added!'
      });
    }
    return exits.error({
      message: 'Error! while adding!'
    });
  }


};
