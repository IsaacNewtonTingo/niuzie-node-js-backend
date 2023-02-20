const { Product } = require("../models/seller/products");

const currentDate = Date.now();

Product.updateMany(
  { expiryDate: { $lt: currentDate } },
  { active: false, reviewed: false, verified: false, pending: true }
)
  .then((response) => {
    if (response.modifiedCount > 0) {
      console.log("Expired products found and updated");
    } else {
      console.log("No expired products found");
    }
  })
  .catch((err) => {
    console.log(err);
  });
