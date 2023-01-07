const mongoose = require("mongoose");
const { SubCategory } = require("../models/admin/sub-category");

require("dotenv").config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const seedSubCategories = [
  {
    category: "63b9945570b977b9b624ff2d",
    subCategoryName: "Sneakers",
  },
  {
    category: "63b9945570b977b9b624ff2d",
    subCategoryName: "Slippers",
  },
  {
    category: "63b9945570b977b9b624ff2d",
    subCategoryName: "Office shoes",
  },
  {
    category: "63b9945570b977b9b624ff2d",
    subCategoryName: "Open shoes",
  },
  {
    category: "63b9945570b977b9b624ff2d",
    subCategoryName: "Closed shoes",
  },
  {
    category: "63b9945570b977b9b624ff2d",
    subCategoryName: "Leather shoes",
  },
];

const seedDB = async () => {
  await SubCategory.insertMany(seedSubCategories);
};
seedDB().then(() => {
  mongoose.connection.close();
});
