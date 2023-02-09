const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    phoneNumber: Number,
    otp: String,
  },
  { timestamps: true }
);
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

exports.Otp = mongoose.model("Otp", OtpSchema);
