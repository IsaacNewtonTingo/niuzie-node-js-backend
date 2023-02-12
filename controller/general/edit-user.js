const User = require("../../models/general/user");
const bcrypt = require("bcrypt");
const { sendOTP } = require("../../helpers/otp");
const { Otp } = require("../../models/general/otps");

exports.editProfile = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const userID = req.params.id;
  const user = await User.findOne({ _id: userID });
  if (user) {
    //check if phone number exists
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (!existingPhoneNumber || existingPhoneNumber._id == userID) {
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
        message:
          "The provided phone number is already registered toa nother account",
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
  const {
    firstName,
    lastName,
    profilePicture,
    phoneNumber,
    county,
    subCounty,
  } = req.body;
  const userID = req.params.id;

  try {
    await User.findOneAndUpdate(
      { _id: userID },
      { firstName, lastName, profilePicture, phoneNumber, county, subCounty }
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

//change password
exports.updatePassword = async (req, res) => {
  try {
    const userID = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ _id: userID });
    if (user) {
      const storedPassword = user.password;
      const correctPassword = await bcrypt.compare(oldPassword, storedPassword);

      if (correctPassword) {
        //hash new
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        //update
        await user.updateOne({ password: hashedNewPassword });
        res.json({
          status: "Success",
          message: "You have successfully changed your password",
        });
      } else {
        res.json({
          status: "Failed",
          message: "Your old password is incorrect",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating password",
    });
  }
};
