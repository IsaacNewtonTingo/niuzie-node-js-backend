const User = require("../../models/general/user");
const bcrypt = require("bcrypt");
const { sendOTP } = require("../../helpers/otp");
const { Otp } = require("../../models/general/otps");

exports.editProfile = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const userID = req.params.id;
  const user = await User.findOne({ _id: userID });
  if (user) {
    //check if password is correct
    const storedPassword = user.password;
    const correctPassword = await bcrypt.compare(password, storedPassword);

    if (correctPassword) {
      //generate otp
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      //find existing and delete
      await Otp.findOneAndDelete({ phoneNumber });
      //store otp
      const hashedOtp = await bcrypt.hash(otp, 10);
      await Otp.create({
        user: userID,
        phoneNumber,
        otp: hashedOtp,
      });
      //send otp
      sendOTP(phoneNumber, otp, res);
    } else {
      res.json({
        status: "Failed",
        message: "Incorrect password",
      });
    }
  } else {
    res.json({
      status: "Failed",
      message: "User not found",
    });
  }

  try {
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating user records",
    });
  }
};

//verify otp
exports.updateRecords = async (req, res) => {
  const { firstName, lastName, phoneNumber, county, subCounty } = req.body;
  const userID = req.params.id;

  try {
    await User.findOneAndUpdate(
      { _id: userID },
      { firstName, lastName, phoneNumber, county, subCounty }
    );

    res.json({
      status: "Success",
      message: "User records successfully updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating user records",
    });
  }
};
