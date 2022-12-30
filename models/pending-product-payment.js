const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendingTicketPurchaseSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: Number,
    phoneNumber: Number,
    accountNumber: String,
    verified: Boolean,
  },
  { timestamps: true }
);

const PendingTicketPurchase = mongoose.model(
  "PendingTicketPurchase",
  PendingTicketPurchaseSchema
);
module.exports = PendingTicketPurchase;
