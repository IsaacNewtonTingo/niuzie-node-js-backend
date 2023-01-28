const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PremiumUsersSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amountPaid: Number,
    expiryDate: {
      type: Date,
      default: Date.now() + 604800000,
    },
  },
  { timestamps: true }
);

exports.PremiumUsers = mongoose.model("PremiumUsers", PremiumUsersSchema);
