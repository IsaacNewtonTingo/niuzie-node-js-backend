const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendingEmailVerificationSchema = new Schema(
  {
    email: String,
    verificationCode: String,
  },
  { timestamps: true }
);

PendingEmailVerificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
);

exports.EmailVerification = mongoose.model(
  "PendingEmailVerification",
  PendingEmailVerificationSchema
);
