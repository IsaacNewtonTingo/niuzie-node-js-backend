const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuyerNeedSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
  },
  { timestamps: true }
);

exports.BuyerNeed = mongoose.model("BuyerNeed", BuyerNeedSchema);
