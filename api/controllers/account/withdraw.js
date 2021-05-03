module.exports = {


  friendlyName: 'Withdraw',


  description: 'Withdraw account.',


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
    let amountUpdated = await AccountInfo.findOne({user: this.req.session.me.id});
    if (amountUpdated.balance < inputs.amount) {
      return exits.error({
        message: 'You dont have sufficient balance'
      });
    }
    let updatedAmount = await AccountInfo.updateOne({user: this.req.session.me.id}).set({balance: amountUpdated.balance - inputs.amount});
    await History.create({
      date:  new Date().toJSON(),
      status: 'success',
      type: 'debit',
      amount: inputs.amount,
      account: amountUpdated.id
    });
    if (!updatedAmount) {
      return exits.error({
        message: 'Something went wrong while withdrawing!'
      });
    }
    const email = {
      to: this.req.session.me.email,
      subject: 'Account Debit!',
      template: 'withdraw',
      context: {
        name: this.req.session.me.fullName,
        withdrawAmount: inputs.amount,
        currentAmount: updatedAmount.balance
      },
    };
    //await sails.helpers.sendMail(email);
    EmailService.sendMail({email: email});
    return exits.success({
      message: 'Amount withdrawal successfully!'
    });
  }


};
