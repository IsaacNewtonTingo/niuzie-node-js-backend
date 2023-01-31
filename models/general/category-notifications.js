const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryNotificationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const CategoryNotification = mongoose.model(
  "CategoryNotification",
  CategoryNotificationSchema
);
module.exports = CategoryNotification;
