const User = require("../../models/general/user");
const bcrypt = require("bcrypt");
//set admin
exports.addAdmin = async (req, res) => {
  try {
    const userID = req.params.id;
    const { firstName, lastName, phoneNumber, password } = req.body;

    const admin = await User.findOne({ _id: userID });
    if (admin.roleID == 0) {
      //check phone
      const existingUser = await User.findOne({ phoneNumber });
      if (!existingUser) {
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
          message:
            "User with the given phone number already exists. Please use a different number",
        });
      }
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

//get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ roleID: 1 });
    res.json({
      status: "Success",
      message: "Admins retrieved successfully",
      data: admins,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting admins",
    });
  }
};

//remove admin
exports.removeAdmin = async (req, res) => {
  try {
    const { superAdminID } = req.query;
    const toDeleteID = req.params.id;

    const superAdmin = await User.findOne({ _id: superAdminID });
    if (superAdmin.roleID == 0) {
      await User.findOneAndDelete({ _id: toDeleteID });
      res.json({
        status: "Success",
        message: "Admin deleted successfully",
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
      message: "An error occured while removing admin",
    });
  }
};
