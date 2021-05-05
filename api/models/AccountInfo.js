/**
 * AccountInfo.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    accountNo: {type: 'string', required: true, columnName: 'account_no'},
    /*branchCode: {
      model: 'branch',
      required: true
    },
    accountType: {
      model: 'accountType',
      required: true
    },*/
    balance: {type: 'number', defaultsTo: 0},
    user: {
      model: 'user'
    }
  },

  isAccountExist: function (inputs, cb) {
    console.log(inputs);
    AccountInfo.findOne({user: inputs.id}).exec(cb);
  }

};

