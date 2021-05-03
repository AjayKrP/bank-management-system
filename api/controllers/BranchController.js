/**
 * BranchController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getBranchCode: function (req, res) {
    EmailService.sendMail({email: 'kajay5080@gmail.com'});
    res.json({ping: true});
  }
};

