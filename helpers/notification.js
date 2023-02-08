const { Expo } = require("expo-server-sdk");
// Initialize Expo
const expo = new Expo();

async function sendNotification(pushTokens, title, body, product) {
  let notifications = [];
  for (let pushToken of pushTokens) {
    // Check that all push tokens are valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    // Construct the notification to send
    notifications.push({
      to: pushToken,
      sound: "default",
      title: title,
      body: body,
      data: { product },
    });
  }

  let chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
}

module.exports = {
  sendNotification,
};
