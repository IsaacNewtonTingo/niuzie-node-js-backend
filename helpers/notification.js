const { Expo } = require("expo-server-sdk");
// Initialize Expo
const expo = new Expo();

async function sendNotification(a, b) {
  console.log(a + b);
}

module.exports = {
  sendNotification,
};
