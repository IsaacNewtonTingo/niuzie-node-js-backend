const mongoose = require("mongoose");
const { Category } = require("../models/admin/categories");

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

const seedCategories = [
  {
    categoryImage: "https://i.postimg.cc/L5kg4LkV/phone.png",
    categoryName: "Phones & tablets",
  },
  {
    categoryImage: "https://i.postimg.cc/RhyB6DM1/pngegg-88.png",
    categoryName: "Shoes",
  },
  {
    categoryImage: "https://i.postimg.cc/5t2brvkC/pngegg-87.png",
    categoryName: "Clothes",
  },
  {
    categoryImage: "https://i.postimg.cc/SNG0pR97/pngegg-89.png",
    categoryName: "Vehicles",
  },
  {
    categoryImage: "https://i.postimg.cc/1XPWW0vx/pngegg-90.png",
    categoryName: "Animals",
  },
  {
    categoryImage: "https://i.postimg.cc/nrRvvq5G/software.png",
    categoryName: "Software",
  },
  {
    categoryImage: "https://i.postimg.cc/3NVk81VV/pngegg-91.png",
    categoryName: "Food",
  },
  {
    categoryImage: "https://i.postimg.cc/L6PXkzr4/pngegg-94.png",
    categoryName: "Property",
  },
  {
    categoryImage: "https://i.postimg.cc/gc8j8y9z/pngegg-95.png",
    categoryName: "Repair & construction",
  },
  {
    categoryImage: "https://i.postimg.cc/rwv7142T/pngegg-96.png",
    categoryName: "Health & beauty",
  },
  {
    categoryImage: "https://i.postimg.cc/B6CyfwLZ/pngegg-93.png",
    categoryName: "Games & toys",
  },
  {
    categoryImage: "https://i.postimg.cc/mrjNLxwn/stationary.png",
    categoryName: "Stationary",
  },
  {
    categoryImage: "https://i.postimg.cc/NF3RJQsK/electronics.png",
    categoryName: "Electronics",
  },
  {
    categoryImage: "https://i.postimg.cc/L6PXkzr4/pngegg-94.png",
    categoryName: "Home items",
  },
  {
    categoryImage: "https://i.postimg.cc/CxV2Pqxs/office.png",
    categoryName: "Office",
  },
  {
    categoryImage: "https://i.postimg.cc/gJrtXygm/school.png",
    categoryName: "School",
  },
];

const seedDB = async () => {
  await Category.insertMany(seedCategories);
};
seedDB().then(() => {
  mongoose.connection.close();
});
