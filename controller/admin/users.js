const User = require("../../models/general/user");
const bcrypt = require("bcrypt");
//set admin
exports.addAdmin = async (req, res) => {
  try {
    const userID = req.params.id;
    const { firstName, lastName, phoneNumber, password } = req.body;

    const admin = await User.findOne({ _id: userID });
    if (admin.roleID == 0) {
      await User.create({
        firstName,
        lastName,
        phoneNumber,
        password: await bcrypt.hash(password, 10),
        profilePicture: "",
        county: "",
        subCounty: "",
        roleID: 1,
        admin: true,
      });

      res.json({
        status: "Success",
        message: "Admin created successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "You don't have adequate rights to perform this operation",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while adding admin",
    });
  }
};
