const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema(
  {
    subCategoryName: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

exports.SubCategory = mongoose.model("SubCategory", SubCategorySchema);
