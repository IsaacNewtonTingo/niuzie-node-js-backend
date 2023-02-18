const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { ProductReview } = require("../models/seller/product-reviews");
const User = require("../models/general/user");
const { Product } = require("../models/seller/products");

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
  const products = await Product.find({});

  for (let i = 0; i < 10000000; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomUserIndex];

    const randomProductIndex = Math.floor(Math.random() * products.length);
    const randomProduct = products[randomProductIndex];

    await ProductReview.create({
      user: randomUser._id,
      product: randomProduct._id,
      reviewMessage: faker.lorem.paragraph(),
      rating: faker.datatype.number({ min: 1, max: 5 }),
    });
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
