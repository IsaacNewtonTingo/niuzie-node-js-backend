const mongoose = require("mongoose");
const { Product } = require("../models/seller/products");
const { faker } = require("@faker-js/faker");
const User = require("../models/general/user");
const { Category } = require("../models/admin/categories");
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

const seedDB = async () => {
  const users = await User.find({});
  const categories = await Category.find({});
  const subCategories = await SubCategory.find({});

  for (let i = 0; i < 100000; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomUserIndex];

    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomCategoryIndex];

    const randomSubCategoryIndex = Math.floor(
      Math.random() * subCategories.length
    );
    const randomSubCategories = subCategories[randomSubCategoryIndex];

    const conditions = [
      "New",
      "Used, in working conditions",
      "Used, with minor defects",
    ];
    const randomCondition =
      conditions[Math.floor(Math.random() * conditions.length)];

    await Product.create({
      user: randomUser._id,
      productName: faker.commerce.productName(),
      category: randomCategory,
      subCategory: randomSubCategories,
      condition: randomCondition,
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      image1: faker.image.faker.internet.avatar(),
      image2: faker.image.faker.internet.avatar(),
      image3: faker.image.faker.internet.avatar(),
      image4: faker.image.faker.internet.avatar(),

      promoted: faker.datatype.boolean(),
      paid: faker.datatype.boolean(),
      pending: faker.datatype.boolean(),
      reviewed: faker.datatype.boolean(),
      verified: faker.datatype.boolean(),
      active: faker.datatype.boolean(),
      rating: faker.datatype.number({ min: 1, max: 5 }),
    });
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
