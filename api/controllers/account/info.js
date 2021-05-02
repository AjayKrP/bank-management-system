module.exports = {


  friendlyName: 'Info',


  description: 'Info account.',


  inputs: {
    email: {
      type: 'string'
    }
  },


  exits: {
    success: {
      statusCode: 201,
      description: 'New user created',
    },
    error: {
      description: 'Something went wrong',
    }
  },


  fn: async function (inputs, exits) {
    if (this.req.session.me.email !== inputs.email) {
      return exits.error({
        message: 'Email address mismatch!'
      });
    }
    let accountInfo = await AccountInfo.find({user: this.req.session.me.id}).populate('user');
    if (accountInfo) {
      return exits.success({
        info: accountInfo
      });
    }
    return exits.error({
      message: 'Nothing found for this email address.'
    });
  }

};
