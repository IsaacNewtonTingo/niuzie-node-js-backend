const mongoose = require("mongoose");
const CategoryNotification = require("../models/general/category-notifications");

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

const seedCategoryNotifs = [
  {
    user: "63bc1009169dfbdcbfcf1216",
    category: "63b9945570b977b9b624ff2d",
  },
  {
    user: "63d816c2944e6012ff572cc5",
    category: "63b9945570b977b9b624ff2d",
  },
];

const seedDB = async () => {
  await CategoryNotification.insertMany(seedCategoryNotifs);
};
seedDB().then(() => {
  mongoose.connection.close();
});
