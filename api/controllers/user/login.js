module.exports = {


  friendlyName: 'User Login API',


  description: 'API for Login user. Without login users cant access any pages.',


  inputs: {
    email: {
      type: 'string',
      required: true,
      example: 'abc@xyz.com'
    },
    password: {
      type: 'string',
      required: true,
      example: 'xyes!567'
    },
  },


  exits: {
    success: {
      description: 'Login successful',
    },
    notAUser: {
      statusCode: 404,
      description: 'User not found',
    },
    passwordMismatch: {
      statusCode: 401,
      description: 'Password do not match',
    },
    operationalError: {
      statusCode: 400,
      description: 'The request was formed properly'
    }
  },


  fn: async function (inputs, exits) {

    try {
      /**
       * Find user by email address
       */
      const user = await User.findOne({email: inputs.email});
      /**
       * If user doesnt exist with that email then throw error
       */
      if (!user) {
        return exits.notAUser({
          error: `An account belonging to ${inputs.email} was not found`,
        });
      }
      /**
       * Match currently entred password with the hashed password if its not matching then
       * then throw error
       */
      await sails.helpers.passwords
        .checkPassword(inputs.password, user.password)
        .intercept('incorrect', (error) => {
          exits.passwordMismatch({error: error.message});
        });
      /**
       * Generate a token which will be used as JWT token
       */
      const token = await sails.helpers.generateNewJwtToken(user.email);
      this.req.me = user;
      this.req.session.me = user;
      this.req.session.save();
      return exits.success({
        message: `${user.email} has been logged in`,
        data: user,
        token,
      });
    } catch (error) {
      sails.log.error(error);
      if (error.isOperational) {
        return exits.operationalError({
          message: `Error logging in user ${inputs.email}`,
          error: error.raw,
        });
      }
      return exits.error({
        message: `Error logging in user ${inputs.email}`,
        error: error.message,
      });
    }

  }


};
