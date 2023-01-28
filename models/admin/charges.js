const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChargesSchema = new Schema(
  {
    name: String,
    amount: Number,
  },
  { timestamps: true }
);

exports.Charges = mongoose.model("Charges", ChargesSchema);
