const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    categoryName: String,
    categoryImage: String,
  },
  { timestamps: true }
);

exports.Category = mongoose.model("Category", CategorySchema);
