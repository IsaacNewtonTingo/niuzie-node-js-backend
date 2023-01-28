const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SaveProductSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const SaveProduct = mongoose.model("SaveProduct", SaveProductSchema);
module.exports = SaveProduct;
