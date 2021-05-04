/**
 * History.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    date: {
      type: 'string'
    },
    status: {type: 'string'},
    description: {type: 'string'},
    type: {type: 'string'},
    amount: {type: 'float', required: true},
    account: {
      model: 'accountinfo',
      required: true
    }
  },

  /**
   *
   * @param inputs
   * @param cb
   */
  addHistory: function (inputs, cb) {
    // Create a user
    History.create({
      date: new Date().toJSON(),
      status: inputs.status,
      type: inputs.type,
      amount: inputs.amount,
      account: inputs.account
    })
      .exec(cb);
  },
};

