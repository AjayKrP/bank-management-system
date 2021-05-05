module.exports = {


  friendlyName: 'Confirm user API',


  description: 'Once user receive account Confirmation mail. Then on hitting that url it will verify users account.',


  inputs: {
    token: {
      type: 'string',
      description: 'The confirmation token from the email.',
      example: '4-32fad81jdaf$329',
    },
  },


  exits: {
    success: {
      description: 'Email address confirmed and requesting user logged in.',
    },
    invalidOrExpiredToken: {
      statusCode: 400,
      description:
        'The provided token is expired, invalid, or already used up.',
    },
  },


  fn: async function (inputs, exits) {
    /**
     * If input token is empty then return invalidOrExpiredToken error
     */
    if (!inputs.token) {
      return exits.invalidOrExpiredToken({
        error: 'The provided token is expired, invalid, or already used up.',
      });
    }
    /**
     * Find users by input token and check their account status if its unconfirmed
     * then account status is unconfirmed then make it confirmed
     */
    var user = await User.findOne({emailProofToken: inputs.token});

    /**
     * check token expiry date if its less than the total expiry time then throw error
     */
    if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
      return exits.invalidOrExpiredToken({
        error: 'The provided token is expired, invalid, or already used up.',
      });
    }
    /**
     * If email is unconfirmed then make it confirm
     */
    if (user.emailStatus === 'unconfirmed') {
      await User.updateOne({id: user.id}).set({
        emailStatus: 'confirmed',
        emailProofToken: '',
        emailProofTokenExpiresAt: 0,
      });
      return exits.success({
        message: 'Your account has been confirmed',
      });
    }
  }


};
