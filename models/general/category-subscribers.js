const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySubscribersSchema = new Schema(
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

const CategorySubscribers = mongoose.model(
  "CategorySubscribers",
  CategorySubscribersSchema
);
module.exports = CategorySubscribers;
