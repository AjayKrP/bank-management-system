module.exports = {


  friendlyName: 'Create',


  description: 'Create account.',


  inputs: {
    street: {
      type: 'string',
      required: true,
    },
    city: {
      type: 'string',
      required: true,
    },
    postalCode: {
      type: 'string',
      required: true,
      length: 6,
    },
    country: {
      type: 'string',
      required: true
    }
  },


  exits: {
    success: {
      statusCode: 201,
      description: 'New user created',
    },
    error: {
      description: 'Something went wrong',
    },
  },


  fn: async function (req, inputs, exits) {
    console.log(this.req.me.email);
    try {
      if (this.req.me.email !== inputs.email) {
        return exits.error({
          message: 'Email mismatch! Please check your email and try again.'
        });
      }

      /**
       * Create new address
       * @type {Response}
       */
      let address = await Address.create({
        street: inputs.street,
        city: inputs.city,
        state: inputs.street,
        country: inputs.country,
        user: this.req.me,
      }).fetch();

      /**
       * assign address to the user
       */
      let updatedUser = await User.updateOne({email: inputs.email}).set({
        address: address.id
      });
      if (updatedUser) {
        sails.log('user address has been added!');
      } else {
        return exits.error({
          message: 'Error While updating user address.'
        });
      }
      let account = await AccountInfo.create({
        accountNo: await sails.helpers.generateAccountNo(),
        customerId: this.req.me.id
      }).fetch();

      /**
       * Send create account email to customer
       * @type {{template: string, subject: string, context: {name: ({type: string, required: boolean, columnName: string}|{type: string, required: boolean})}, to: *}}
       */
      const email = {
        to: inputs.email,
        subject: 'Account Create Successful',
        template: 'account-create',
        context: {
          name: this.req.me.fullName,
        },
      };
      //await sails.helpers.sendMail(email);
      EmailService.sendMail({email: email});
      return exits.success({
        message: `Your account has been created for ${newUser.email} successfully.`,
      });
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        return exits.emailAlreadyInUse({
          message: 'Oops :) an error occurred',
          error: 'This email address already exits',
        });
      }
      return exits.error({
        message: 'Oops :) an error occurred',
        error: error.message,
      });
    }
  }

};
