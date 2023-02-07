const User = require("../../models/general/user");
const { Payments } = require("../../models/general/user-payments");

//get total revenue
exports.getRevenue = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findOne({ _id: userID });
    if (user.admin == true) {
      const payments = await Payments.find({});

      //-----------------------------------------
      const premiumRevenue = payments.filter((payment) => payment.premium);
      const totalPremium =
        premiumRevenue.length > 0
          ? premiumRevenue
              .map((revenue) => revenue.amountPaid)
              .reduce((acc, revenue) => revenue + acc)
          : 0;

      //---------------------------------------
      const extraProductRevenue = payments.filter(
        (payment) => payment.extraProduct
      );
      const totalExtraRev =
        extraProductRevenue.length > 0
          ? extraProductRevenue
              .map((revenue) => revenue.amountPaid)
              .reduce((acc, revenue) => revenue + acc)
          : 0;

      //-----------------------------------------
      const productPromoRevenue = payments.filter(
        (payment) => payment.productPromotion
      );
      const totalProductPromoRev =
        productPromoRevenue.length > 0
          ? productPromoRevenue
              .map((revenue) => revenue.amountPaid)
              .reduce((acc, revenue) => revenue + acc)
          : 0;

      //----------------------------------------
      const totalRevenue = totalPremium + totalExtraRev + totalProductPromoRev;

      res.json({
        status: "Success",
        message: "Revenue retrieved successfully",
        data: {
          totalRevenue,
          premiumRevenue: totalPremium,
          extraProductRevenue: totalExtraRev,
          productPromoRevenue: totalProductPromoRev,
        },
      });
    } else {
      res.json({
        status: "Failed",
        message: "Anauthorized operation",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting revenue",
    });
  }
};
