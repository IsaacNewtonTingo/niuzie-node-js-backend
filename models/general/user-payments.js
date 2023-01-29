const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    phoneNumber: Number,
    extraProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    productPromotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    accountNumber: String,
    amountPaid: Number,
  },
  { timestamps: true }
);

exports.Payments = mongoose.model("Payments", PaymentsSchema);
