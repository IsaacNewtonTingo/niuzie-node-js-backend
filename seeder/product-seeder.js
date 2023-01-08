const mongoose = require("mongoose");
const { Product } = require("../models/seller/products");
const { faker } = require("@faker-js/faker");

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

const seedProducts = [
  {
    user: "63b2b28ad56b224ad8514e91",
    productName: faker.commerce.productName(),
    category: "63b2b380d56b224ad8514e9c",
    subCategory: "63b2b3b4d56b224ad8514e9f",
    condition: "New",
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    image1: faker.image.business(),
    image2: faker.image.business(),
    image3: faker.image.business(),
    image4: faker.image.business(),

    promoted: true,
    verified: true,
    rating: faker.datatype.number({ min: 1, max: 5 }),
  },
];

const seedDB = async () => {
  for (let i = 0; i < 100; i++) {
    await Product.insertMany(seedProducts);
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
