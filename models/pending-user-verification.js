const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendingUserVerificationSchema = new Schema(
  {
    phoneNumber: Number,
    verificationCode: String,
  },
  { timestamps: true }
);

PendingUserVerificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 600 }
);

const UserVerification = mongoose.model(
  "PendingUserVerification",
  PendingUserVerificationSchema
);
module.exports = UserVerification;
