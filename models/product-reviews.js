const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductReviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    reviewMessage: String,
    rating: Number,
  },
  { timestamps: true }
);

exports.ProductReview = mongoose.model("ProductReview", ProductReviewSchema);
