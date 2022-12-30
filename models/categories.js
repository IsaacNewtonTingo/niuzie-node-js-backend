const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategprySchema = new Schema(
  {
    categoryName: String,
  },
  { timestamps: true }
);

exports.Category = mongoose.model("Category", CategprySchema);
