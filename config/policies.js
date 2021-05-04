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
  'account/create': 'can-access',
  'account/info': 'can-access',
  'account/deposit': 'can-access',
  'account/withdraw': 'can-access',
  'account/transfer': 'can-access',
  'account/history': 'can-access',
  'account/delete': 'can-access',
};
