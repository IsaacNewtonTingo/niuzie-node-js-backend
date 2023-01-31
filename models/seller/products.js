const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productName: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    condition: String,
    description: String,
    price: Number,
    rating: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },
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
    reviewed: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
      default: Date.now() + 7776000000,
    },
    expiryNotificationDate: {
      type: Date,
      default: Date.now() + 6912000000,
    },
    tenDayExpirationEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// ProductSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

exports.Product = mongoose.model("Product", ProductSchema);
