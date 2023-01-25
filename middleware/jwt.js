const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    res.json({
      status: "Failed",
      message: "Access denied.",
    });
  } else {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      console.log(error);
      res.json({
        status: "Failed",
        message: "Invalid authorization code passed",
        error: error.message,
      });
    }
  }
};
