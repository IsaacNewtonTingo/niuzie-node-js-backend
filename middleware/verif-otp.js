const { Otp } = require("../models/general/otps");

exports.verifyOTP = async (req, res, next) => {
  let { phoneNumber, otp, userID } = req.body;
  otp = otp.trim();
  const existingOtp = await Otp.findOne({
    $and: [{ phoneNumber }, { otp }],
  });

  if (existingOtp) {
    await existingOtp.deleteOne();
    next();
  } else {
    res.json({
      status: "Failed",
      message: "Invalid otp",
    });
  }
};
