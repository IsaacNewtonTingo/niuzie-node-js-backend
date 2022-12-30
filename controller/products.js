const { Product } = require("../models/products");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const request = require("request");

exports.postProduct = async (req, res) => {
  try {
    const {
      userID,
      phoneNumber,
      productName,
      description,
      price,
      image1,
      image2,
      image3,
      image4,
    } = req.body;
    const user = await User.findOne({ _id: userID });
    const premiumUser = user.premium;

    const newProduct = new Product({
      user: userID,
      productName,
      description,
      price,
      image1,
      image2,
      image3,
      image4,
      promoted: true,
      expiryDate: Date.now() + 7776000000,
    });

    if (premiumUser == true) {
      await newProduct.save();

      res.json({
        status: "Success",
        message: "Product posted successfully",
      });
    } else {
      //check number of products they have
      const userProducts = await Product.find({ user: userID });
      const numberOfProducts = userProducts.length;

      if (numberOfProducts >= 2) {
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

        //you have to pay to add more products
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
                paymentStatus(accountNumber, res);
              }
            }
          }
        );
      } else {
        //you have the chance to post another

        await newProduct.save();

        res.json({
          status: "Success",
          message: "Product posted successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while posting your product",
    });
  }
};

const paymentStatus = async (accountNumber, res) => {
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

            res.json({
              status: "Success",
              message: "Payment made successfully",
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
