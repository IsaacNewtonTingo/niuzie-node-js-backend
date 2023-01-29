const { Payments } = require("../../models/general/user-payments");

exports.getPayments = async (req, res) => {
  try {
    const userID = req.params.id;

    const payments = await Payments.find({ user: userID })
      .populate("extraProduct")
      .populate("productPromotion")
      .sort({
        createdAt: -1,
      });

    res.json({
      status: "Success",
      message: "Retrieved successfully",
      data: payments,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting user payments",
    });
  }
};
