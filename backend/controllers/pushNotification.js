// In your controller file
const sendPushNotification = require('../services/pushNotification');

const sendNotification = async (req, res) => {
  const { pushToken } = req.body;

  const notificationSent = await sendPushNotification(pushToken, "Stockwise", "👋 Welcome to Dashboard");

  if (notificationSent) {
    res.status(200).json({ success: true, message: "Notification sent successfully" });
  } else {
    res.status(500).json({ success: false, error: "Failed to send notification" });
  }
};

module.exports = { sendNotification };
