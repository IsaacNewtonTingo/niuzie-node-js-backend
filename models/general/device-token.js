const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceTokenSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    token: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

exports.DeviceToken = mongoose.model("DeviceToken", DeviceTokenSchema);
