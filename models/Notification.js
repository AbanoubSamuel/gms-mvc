const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  notificationMsg: {
    type: String,
  },
  notificationSender: {
    type: String,
  },
  notificationDate: {
    type: String,
    indexed: true,
  },
});
notification = mongoose.model("Notification", notificationSchema);
module.exports = notification;
