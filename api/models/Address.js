/**
 * Address.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    street: {type: 'string'},
    city: {type: 'string'},
    postalCode: {type: 'string'},
    state: {type: 'string'},
    country: {type: 'string'},
    user: {
      collection:'user',
      via: 'address'
    }
  },

};

