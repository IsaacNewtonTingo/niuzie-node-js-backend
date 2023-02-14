const { sendSMS } = require("../helpers/send-sms");
const { Product } = require("../models/seller/products");

currentDate = Date.now();

Product.find({
  $and: [
    { expiryNotificationDate: { $lt: currentDate } },
    { tenDayExpirationEmailSent: false },
  ],
})
  .populate("user", "firstName lastName email phoneNumber")
  .populate("category")
  .populate("subCategory")
  .then(async (response) => {
    response.filter(async function (product) {
      const firstName = product.user.firstName;
      const phoneNumber = product.user.phoneNumber;
      const productName = product.productName;
      const formatedDate = product.expiryDate.toDateString();

      const message = `Hello ${firstName}. Your product ${productName} will expire on ${formatedDate}. Please make sure you update it as soon as possible.`;

      await sendSMS(phoneNumber, message).then(async () => {
        //update  that email has been sent
        await product.updateOne({ tenDayExpirationEmailSent: true });
      });
    });
  });
