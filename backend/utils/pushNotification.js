const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (pushToken, title, body) => {
  try {
    const message = {
      notification: {
        title: title || "Stockwise",
        body: body || "👋 Welcome to Dashboard",
      },
      token: pushToken,
    };

    await admin.messaging().send(message);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = sendPushNotification;
