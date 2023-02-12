const credentials = {
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USER_NAME,
};

const AfricasTalking = require("africastalking")(credentials);

async function sendOTP(phoneNumber, otp, res) {
  const sms = AfricasTalking.SMS;
  const toPhoneNumber = `+${phoneNumber}`;

  const options = {
    to: toPhoneNumber,
    message: `${otp}`,
    // from: "Party finder",
  };

  await sms.send(options).then(() => {
    res.json({
      status: "Success",
      message: `OTP sent to ${phoneNumber}. The code expires in 5 minutes.`,
    });
  });
}

module.exports = {
  sendOTP,
};
