module.exports = {


  friendlyName: 'Open',


  description: 'Open account.',


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


  fn: async function (inputs, exits) {
    try {
      let accountExists = await AccountInfo.findOne({user: this.req.session.me.id});
      if (accountExists) {
        return exits.error({
          message: 'You have already one account linked with your email. Please contact bank for more details.'
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
        user: this.req.session.me.id,
      }).fetch();

      /**
       * assign address to the user
       */
      let updatedUser = await User.updateOne({email: this.req.session.me.email}).set({
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
        user: this.req.session.me.id
      }).fetch();

      /**
       * Send create account email to customer
       * @type {{template: string, subject: string, context: {name: ({type: string, required: boolean, columnName: string}|{type: string, required: boolean})}, to: *}}
       */
      const email = {
        to: this.req.session.me.email,
        subject: 'Congratulations!',
        template: 'account-create',
        context: {
          name: this.req.session.me.fullName,
          accountNo: account.accountNo,
          customerId: this.req.session.me.id
        },
      };
      //await sails.helpers.sendMail(email);
      EmailService.sendWelcomeMail({email: email});
      return exits.success({
        message: `Your account has been created for ${this.req.session.me.email} successfully.`,
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
