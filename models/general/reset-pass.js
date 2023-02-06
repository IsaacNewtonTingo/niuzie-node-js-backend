const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForgotPasswordSchema = new Schema(
  {
    phoneNumber: Number,
    verificationCode: String,
  },
  { timestamps: true }
);

ForgotPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema);
module.exports = ForgotPassword;
