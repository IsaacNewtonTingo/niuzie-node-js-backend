const { DeviceToken } = require("../../models/general/device-token");

//store token
exports.storeToken = async (req, res) => {
  try {
    const { userID, deviceToken } = req.body;

    //check if token exists

    const token = await DeviceToken.findOne({
      $and: [{ user: userID }, { token: deviceToken }],
    });

    if (token) {
      res.json({
        status: "Success",
        message: "Token has already been stored",
      });
    } else {
      await DeviceToken.create({
        user: userID,
        token: deviceToken,
      });

      res.json({
        status: "Success",
        message: "Successfully stored device token",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while storing device token",
    });
  }
};

//deactivate token
exports.deactivateToken = async (req, res) => {};
