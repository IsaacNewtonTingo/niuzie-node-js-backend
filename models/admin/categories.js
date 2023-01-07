const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategprySchema = new Schema(
  {
    categoryName: String,
    categoryImage: String,
  },
  { timestamps: true }
);

exports.Category = mongoose.model("Category", CategprySchema);
