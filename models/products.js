const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productName: String,
    description: String,
    price: Number,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    promoted: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiryDate: Date,
  },
  { timestamps: true }
);
ProductSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

exports.Product = mongoose.model("Product", ProductSchema);
