module.exports = async function (req, res, proceed) {
  if (req.session.me === undefined) {
    res.status(503).json({
      error: `You are not authorized to access this API. Please login to proceed.`,
    });
  }
  const {email} = req.session.me;

  try {
    const user = await User.findOne({email: email});
    if (!user) {
      res.status(404).json({
        error: `${email} does not belong to a user`,
      });
    } else if (user.emailStatus === 'unconfirmed') {
      res.status(401).json({
        error: 'This account has not been confirmed. Click on the link in the email sent to you to confirm.',
      });
    } else {
      return proceed();
    }
  } catch (error) {
    res.status(401).json({error: error.message});
  }
};
