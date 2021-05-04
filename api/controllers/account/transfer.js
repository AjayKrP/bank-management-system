module.exports = {


  friendlyName: 'Transfer',


  description: 'Transfer account.',


  inputs: {
    account: {
      type: 'number',
      required: true,
      example: 667175841
    },
    fullName: {
      type: 'string',
      required: true
    },
    amount: {
      type: 'number',
      required: true,
      example: 200
    }
  },


  exits: {
    success: {
      status: 200,
      description: 'Amount has been successfully transferred'
    },
    error: {
      description: 'Something went wrong while transferring your amount'
    }
  },


  fn: async function (inputs, exits) {
    const accountNo = inputs.account;
    const fullName = inputs.fullName;
    let senderAccountDetails = await AccountInfo.findOne({user: this.req.session.me.id});
    let accountDetails = await AccountInfo.findOne({accountNo: accountNo});
    if (!accountDetails) {
      return exits.error({
        message: 'Account Not Found!'
      });
    }
    let customerDetails = await AccountInfo.findOne({accountNo: accountNo}).populate('user');
    if (!customerDetails) {
      return exits.error({
        message: 'No customer exists with this account No. Please contact bank manager'
      });
    }
    console.log(customerDetails);
    if (customerDetails.user.fullName !== fullName) {
      return exits.error({
        message: 'Customer name mismatch! Pls try again'
      });
    }
    let sender = await AccountInfo.updateOne({user: this.req.session.me.id}).set({balance: senderAccountDetails.balance - inputs.amount});
    if (!sender) {
      return exits.error({
        message: 'Error while fetching amount from sender account'
      });
    }

    History.addHistory({
      status: 'success',
      type: 'transfer',
      amount: inputs.amount,
      account: senderAccountDetails.id
    }, function (err, success) {
      if (err) {
        return res.negotiate(err);
      }
    });
    var email = {
      to: this.req.session.me.email,
      subject: 'Account Debit!',
      template: 'withdraw',
      context: {
        name: this.req.session.me.fullName,
        debitAmount: inputs.amount,
        currentAmount: sender.balance
      },
    };
    //await sails.helpers.sendMail(email);
    EmailService.sendMail({email: email});
    let receiver = await AccountInfo.updateOne({accountNo: accountNo}).set({balance: accountDetails.balance + inputs.amount});
    if (!receiver) {
      await AccountInfo.updateOne({user: this.req.session.me.id}).set({balance: senderAccountDetails.balance + inputs.amount});
      return exits.error({
        message: 'Error while adding amount to receiver account'
      });
    }

    email = {
      to: customerDetails.user.email,
      subject: 'Account Credit!',
      template: 'deposit',
      context: {
        name: customerDetails.user.fullName,
        creditAmount: inputs.amount,
        currentAmount: receiver.balance
      },
    };
    //await sails.helpers.sendMail(email);
    EmailService.sendMail({email: email});
    History.addHistory({
      status: 'success',
      type: 'transfer',
      amount: inputs.amount,
      account: receiver.id
    }, function (err, success) {
      if (err) {
        return res.negotiate(err);
      }
    });

    return exits.success({
      message: 'Amount has been successfully transfered'
    });
  }


};
