const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompletedPremiumPaymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    amount: Number,
    phoneNumber: Number,
    accountNumber: String,
  },
  { timestamps: true }
);

exports.CompletedPremiumPayment = mongoose.model(
  "CompletedPremiumPayment",
  CompletedPremiumPaymentSchema
);
