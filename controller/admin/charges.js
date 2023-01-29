const { Charges } = require("../../models/admin/charges");
const User = require("../../models/general/user");

exports.createCharge = async (req, res) => {
  try {
    const { name, amount, userID } = req.body;
    //find user
    const user = await User.findOne({ _id: userID });
    if (user.admin !== true) {
      res.json({
        status: "Failed",
        message: "You don't have rights to perform this operation",
      });
    } else {
      const newCharge = new Charges({
        name,
        amount,
      });

      await newCharge.save();

      res.json({
        status: "Success",
        message: "Added successfully",
        data: newCharge,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while creating",
    });
  }
};

exports.getCharge = async (req, res) => {
  try {
    const charges = await Charges.find({});
    res.json({
      status: "Success",
      message: "Retrieved successfully",
      data: charges,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while creating",
    });
  }
};

exports.getOneCharge = async (req, res) => {
  const chargeID = req.params.id;
  try {
    const charge = await Charges.findOne({ _id: chargeID });
    res.json({
      status: "Success",
      message: "Retrieved successfully",
      data: charge,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while creating",
    });
  }
};

exports.editCharge = async (req, res) => {
  const chargeID = req.params.id;
  const { amount, userID } = req.body;
  try {
    const user = await User.findOne({ _id: userID });
    if (user.admin !== true) {
      res.json({
        status: "Failed",
        message: "You don't have rights to perform this operation",
      });
    } else {
      await Charges.findOneAndUpdate({ _id: chargeID }, { amount });
      res.json({
        status: "Success",
        message: "Updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while creating",
    });
  }
};
