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
    /**
     * Check if amount is > 0 or not, if its not then throw error
     */
    if (inputs.amount <= 0.0) {
      return exits.amountError({
        message: 'Amount should be greater than 0'
      });
    }
    /**
     * Check if account exists
     */
    let current = await AccountInfo.findOne({user: this.req.session.me.id});
    if (!current) {
      return exits.error({
        message: 'Error! while adding!'
      });
    }
    /**
     * Update amount with the new amount
     */
    let amountUpdated = await AccountInfo.updateOne({user: this.req.session.me.id}).set({balance: inputs.amount + current.balance});

    /**
     * Add transaction to history
     */
    await History.create({
      date: new Date().toJSON(),
      status: 'success',
      type: 'credit',
      amount: inputs.amount,
      account: amountUpdated.id
    });

    /**
     * Prepare mail to send with specified template
     * @type {{template: string, subject: string, context: {name: ({type: string, required: boolean, columnName: string}|{type: string, required: boolean}), currentAmount: ({type: string, defaultsTo: number}|{type: string, defaultsTo: number}), debitAmount: ({type: string, required: boolean}|{isInteger: boolean, min: number, max: number, description: string, moreInfoUrl: string, extendedDescription: string, required: boolean}|{type: string, required: boolean}|PaymentCurrencyAmount)}, to: *}}
     */
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
    EmailService.sendMail({email: email});
    if (amountUpdated) {
      return exits.success({
        message: 'Amount successfully added!'
      });
    }

    /**
     * If amount has not been updated then return this error
     */
    return exits.error({
      message: 'Error! while adding!'
    });
  }


};
