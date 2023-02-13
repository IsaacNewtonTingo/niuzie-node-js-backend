const request = require("request");
const { Payments } = require("../models/general/user-payments");

exports.makePayment = async (req, res, next) => {
  try {
    const { phoneNumber, amount, accountNumber } = req.body;

    //initiate stk push
    const url = `https://tinypesa.com/api/v1/express/initialize`;
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
            checkPayment(accountNumber, res, next);
          } else {
            res.json({
              status: "Failed",
              message: "An error occured while making payment",
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while making payment",
    });
  }
};

async function checkPayment(accountNumber, res, next) {
  try {
    //check payment
    let complete = 0;
    let responseSent = false;

    const interval = setInterval(() => {
      console.log("----Checking payment-----");

      if (complete !== 1 && !responseSent) {
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
              complete = newBody.is_complete;

              if (complete == 1 && !responseSent) {
                clearInterval(interval);
                clearTimeout(timeOut);
                responseSent = true;

                next();
              }
            }
          }
        );
      }
    }, 1000);

    const timeOut = setTimeout(() => {
      clearInterval(interval);

      res.json({
        status: "Failed",
        message:
          "You did not complete the payment process. Please make sure you are next to your phone and make the payment",
      });
    }, 120000);
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while making payment",
    });
  }
}
