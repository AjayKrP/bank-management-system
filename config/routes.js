/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {view: 'pages/homepage'},
  'GET /branch/getBranchCode': 'branch/getBranchCode',
  'POST /user/register': 'user/register',
  'GET /user/confirm': 'user/confirm',
  'POST /user/login': 'user/login',
  'POST /user/forgot-password': 'user/forgot-password',
  'POST /user/reset-password': 'user/reset-password',
  'POST /account/create': 'account/create',
  'GET /account/info': 'account/info',
  'POST /account/deposit': 'account/deposit',
  'POST /account/withdraw': 'account/withdraw',
  'POST /account/transfer': 'account/transfer',
  'GET /account/history': 'account/history',
  'POST /account/delete': 'account/delete',
  'POST /account/open': 'account/open',


  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/


};
