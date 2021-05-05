/**
 * BranchController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * TODO Add branch codes here
   * @param req
   * @param res
   */
  getBranchCode: function (req, res) {
    res.json({ping: true});
  }
};

