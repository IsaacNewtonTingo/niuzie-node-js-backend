const { Product } = require("../models/seller/products");

const currentDate = Date.now();

Product.updateMany(
  { expiryDate: { $lt: currentDate } },
  {
    active: false,
    reviewed: true,
    verified: false,
    pending: false,
    expiryDate: null,
    expiryNotificationDate: null,
  }
)
  .then((response) => {
    if (response.modifiedCount > 0) {
      console.log("Expired products found and updated");

      //send sms to seller saying their product has expired
    } else {
      console.log("No expired products found");
    }
  })
  .catch((err) => {
    console.log(err);
  });
