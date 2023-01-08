const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/general/user");

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

const seedUsers = [
  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    profilePicture: faker.internet.avatar(),
    phoneNumber: faker.phone.number("+2547########"),
    email: faker.internet.email(),
    emailVerified: true,
    password: faker.internet.password(),
    county: "Nairobi",
    subCounty: "Kasarani",
  },
];

const seedDB = async () => {
  for (let i = 0; i < 20; i++) {
    await User.insertMany(seedUsers);
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
