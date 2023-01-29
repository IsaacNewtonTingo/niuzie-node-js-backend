const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompletedProductPaymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    amount: Number,
    phoneNumber: Number,
    accountNumber: String,
  },
  { timestamps: true }
);

exports.CompletedProductPayment = mongoose.model(
  "CompletedProductPayment",
  CompletedProductPaymentSchema
);
