const { v4: uuidv4 } = require("uuid");
const request = require("request");
const User = require("../../models/general/user");
const {
  PendingPremiumPayment,
} = require("../../models/general/pending-premium-payment");
const {
  CompletedPremiumPayment,
} = require("../../models/general/complete-premium-payment");
const { PremiumUsers } = require("../../models/general/premium-users");
const { Payments } = require("../../models/general/user-payments");
const { Product } = require("../../models/seller/products");

exports.joinPremium = async (req, res) => {
  const userID = req.params.id;
  const { phoneNumber } = req.body;
  //check if already premium
  //make payment
  //update user model to premium
  //update expiry date
  //add record to premium users
  //change all their products---paid-true,verified-true,active-true,promoted-true,
  //add record to payments

  try {
    const user = await User.findOne({ _id: userID });
    if (user.premium == true) {
      //premium
      res.json({
        status: "Failed",
        message: "You are already a preimum member",
      });
    } else {
      //not premium
      const url = "https://tinypesa.com/api/v1/express/initialize";
      const amount = 1;
      const accountNumber = uuidv4() + userID;
      const body = `amount=${amount}&msisdn=${parseInt(
        phoneNumber
      )}&account_no=${accountNumber}`;
      const headers = {
        Apikey: process.env.APE_30_TINY_PESA_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      };

      request(
        {
          url: url,
          method: "POST",
          headers,
          body,
        },
        async function (error, request, body) {
          if (error) {
            console.log(error);
          } else {
            const jsonBody = JSON.parse(body);
            if (jsonBody.success == true) {
              paymentStatus(userID, accountNumber, amount, phoneNumber, res);

              const newPendingPay = new PendingPremiumPayment({
                user: userID,
                amount,
                accountNumber,
                phoneNumber,
              });

              await newPendingPay.save();
            }
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while making payment",
    });
  }
};

const paymentStatus = async (
  userID,
  accountNumber,
  amount,
  phoneNumber,
  res
) => {
  const interval = setInterval(() => {
    console.log("----Checking payment-----");
    request(
      {
        url: `https://tinypesa.com/api/v1/express/get_status/${accountNumber}`,
        method: "GET",
        headers: {
          Apikey: process.env.APE_30_TINY_PESA_API_KEY,
          Accept: "application/json",
        },
      },
      async function (error, request, body) {
        if (error) {
          console.log(error);
        } else {
          const newBody = JSON.parse(body);
          if (newBody.is_complete == 1) {
            clearInterval(interval);
            clearTimeout(timeOut);

            await PendingPremiumPayment.findOneAndUpdate(
              { accountNumber },
              { verified: true }
            );

            const newCompletedPayment = new CompletedPremiumPayment({
              user: userID,
              amount,
              phoneNumber,
              accountNumber,
            });

            await newCompletedPayment.save();

            const newPremium = new PremiumUsers({
              user: userID,
              amountPaid,
              expiryDate,
            });

            await newPremium.save();

            const newPayment = new Payments({
              user: userID,
              extraProduct: null,
              productPromotion: null,
              premium: true,
              amountPaid,
              accountNumber,
            });

            await newPayment.save();

            await User.findOneAndUpdate(
              { _id: userID },
              { premium: true, endOfPremium: Date.now() + 604800000 }
            );

            await Product.updateMany(
              {
                user: userID,
              },
              { promoted: true, paid: true, verified: true, active: true }
            );

            res.json({
              status: "Success",
              message: "Payment made successfully. Your now a premium member",
            });
          }
        }
      }
    );
  }, 1000);

  const timeOut = setTimeout(() => {
    clearInterval(interval);

    res.json({
      status: "Failed",
      message:
        "You did not complete the payment process. Please make sure you are next to your phone and make the payment",
    });
  }, 120000);
};
