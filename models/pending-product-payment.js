const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendingProductPaymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: Number,
    phoneNumber: Number,
    accountNumber: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

exports.PendingProductPayment = mongoose.model(
  "PendingProductPayment",
  PendingProductPaymentSchema
);
