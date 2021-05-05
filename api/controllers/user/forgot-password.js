module.exports = {


  friendlyName: 'API for Forgot password',


  description: 'this API is Mainly responsible to reset users password',


  inputs: {
    email: {
      description:
        'The email address of the user who wants to recover their password.',
      example: 'albus@dumbledore.com',
      type: 'string',
      required: true,
    },
  },


  exits: {
    success: {
      description:
        'Email matched a user and a recovery email might have been sent',
    },
  },


  fn: async function (inputs, exits) {
    /**
     * Find users by email address
     */
    var user = await User.findOne({email: inputs.email});
    /**
     * If user not found by email then do nothing
     */
    if (!user) {
      return;
    }
    /**
     * generate a token which will be sent to users mail for verification
     */
    const token = await sails.helpers.strings.random('url-friendly');
    /**
     * Update user by its token and expiry time. Which will be used at the time
     * of token verification
     */
    await User.update({id: user.id}).set({
      passwordResetToken: token,
      passwordResetTokenExpiresAt:
        Date.now() + sails.config.custom.passwordResetTokenTTL,
    });
    /**
     * Generate a recovery URL and send it to the mail
     * @type {string}
     */
    const recoveryLink = `${sails.config.custom.baseUrl}/user/reset-password?token=${token}`;
    const email = {
      to: user.emailAddress,
      subject: 'Reset Password',
      template: 'forgot-password',
      context: {
        name: user.fullName,
        recoverLink: recoveryLink,
      },
    };
    /**
     * Send mail to the users for to reset their password
     */
    try {
      EmailService.sendMail({email: email});
    } catch (error) {
      sails.log(error);
    }
    return exits.success({
      message: `A reset password email has been sent to ${user.email}.`,
    });
  }


};
