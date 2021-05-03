module.exports = {


  friendlyName: 'Transfer',


  description: 'Transfer account.',


  inputs: {
    account: {
      type: 'string',
      required: true
    },
    fullName: {
      type: 'string',
      required: true
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
    let customerDetails = await AccountInfo.find({accountNo: accountNo}).populate('user');
    if (!customerDetails) {
      return exits.error({
        message: 'No customer exists with this account No. Please contact bank manager'
      });
    }
    if (customerDetails.fullName !== fullName) {
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
    await History.create({
      date: new Date().toJSON(),
      status: 'success',
      type: 'debit',
      amount: inputs.amount,
      account: senderAccountDetails.id
    });
    let receiver = await AccountInfo.updateOne({accountNo: accountNo}).set({balance: accountDetails.balance + inputs.amount});
    if (!receiver) {
      await AccountInfo.updateOne({user: this.req.session.me.id}).set({balance: senderAccountDetails.balance + inputs.amount});
      return exits.error({
        message: 'Error while adding amount to receiver account'
      });
    }
    await History.create({
      date: new Date().toJSON(),
      status: 'success',
      type: 'credit',
      amount: inputs.amount,
      account: receiver.id
    });
    return exits.success({
      message: 'Amount has been successfully transfered'
    });
  }


};
