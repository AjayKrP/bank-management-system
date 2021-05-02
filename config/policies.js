/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  'user/login': 'can-login',
  'user/forgot-password': 'can-login',
  'account/create': 'can-login',
  'account/info': 'can-login',
  'account/deposit': 'can-login',
  'account/withdraw': 'can-login',
  'account/transfer': 'can-login',
  'account/history': 'can-login',
  'account/delete': 'can-login',
};
