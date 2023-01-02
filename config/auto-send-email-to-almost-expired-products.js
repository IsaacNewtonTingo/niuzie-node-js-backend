const { Product } = require("../models/seller/products");
const nodemailer = require("nodemailer");
const dateFormat = require("node-datetime");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

currentDate = Date.now();

Product.find({
  $and: [
    { expiryNotificationDate: { $lt: currentDate } },
    { tenDayExpirationEmailSent: false },
  ],
})
  .populate("user", "firstName lastName email")
  .populate("category")
  .populate("subCategory")
  .then(async (response) => {
    response.filter(async function (product) {
      const emails = product.user.email;
      const firstName = product.user.firstName;
      const lastName = product.user.lastName;

      const productName = product.productName;
      const category = product.category.categoryName;
      const subCategory = product.subCategory.subCategoryName;
      const formatedDate = product.expiryDate.toDateString();

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: emails,
        subject: "Product expiry alert",
        html: `<p>
               <h2><strong>Hello ${firstName} ${lastName}</strong></h2><br/>
                The product listed below will expire in 10 days.
                <br/>
                <br/>
                    Product name: <strong>${productName}</strong>
                     <br/>
                    Category: <strong>${category}</strong> 
                     <br/>
                    Sub-category: <strong>${subCategory}</strong>
                     <br/>
                    Expiry date: <strong>${formatedDate}</strong>
                <br/>
                <br/>
                Please remember to update it to keep your product live.
                <br/>
                <br/>
                <br/>
                Regards,
                <br/>
                Niuzie team,
                <br/>
                info@niuzie.com
                <br/>
                +254744567645
                <br/>
              </p>`,
      };

      await transporter.sendMail(mailOptions).then(async () => {
        //update  that email has been sent
        await product.updateOne({ tenDayExpirationEmailSent: true });
      });
    });
  });
