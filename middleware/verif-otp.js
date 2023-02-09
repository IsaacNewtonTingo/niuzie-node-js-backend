const { Otp } = require("../models/general/otps");
const bcrypt = require("bcrypt");

exports.verifyOTP = async (req, res, next) => {
  try {
    let { phoneNumber, otp } = req.body;

    const existingOtp = await Otp.findOne({
      phoneNumber,
    });

    if (existingOtp) {
      const hashedOtp = existingOtp.otp;
      const matching = await bcrypt.compare(otp, hashedOtp);

      if (matching) {
        await existingOtp.deleteOne();
        next();
      } else {
        res.json({
          status: "Failed",
          message: "Invalid otp",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Invalid otp",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating user records",
    });
  }
};
