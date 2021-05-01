/**
 * Transaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    transactionId: {type: 'string'},
    frontAccountNo: {
      model: 'accountInfo'
    },
    toAccountNo: {
      model: 'accountInfo'
    },
    typeCode: {type: 'string'},
    debit: {type: 'string'},
    credit: {type: 'string'},
    transactionType: {type: 'string'},
    balance: {type: 'float', defaultsTo: 0.0},
    date: {
      type: 'string', columnType: 'datetime'
    },
    status: {type: 'string'},
    description: {type: 'string'},
    branchCode: {type: 'string'}
  },

};

