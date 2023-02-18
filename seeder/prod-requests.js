const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/general/user");
const { BuyerNeed } = require("../models/buyer/buyer-needs");

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

  for (let i = 0; i < 10000; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomUserIndex];

    await BuyerNeed.create({
      user: randomUser._id,
      content: faker.lorem.paragraph(),
    });
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
