const credentials = {
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USER_NAME,
};

const AfricasTalking = require("africastalking")(credentials);

async function sendSMS(phoneNumber, message) {
  const sms = AfricasTalking.SMS;
  const options = {
    to: phoneNumber,
    message: message,
    // from: "Party finder",
  };

  await sms.send(options);
}

module.exports = {
  sendSMS,
};
