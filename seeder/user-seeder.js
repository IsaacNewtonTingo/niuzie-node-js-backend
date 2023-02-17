const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/general/user");
const bcrypt = require("bcrypt");

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
  const password = "qwertyuiop";
  const encryptedPassword = await bcrypt.hash(password, 0);

  for (let i = 0; i < 100; i++) {
    await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      profilePicture: faker.internet.avatar(),
      phoneNumber: faker.phone.number("+2547########"),
      password: encryptedPassword,
      county: "Nakuru",
      subCounty: "Molo",
      premium: faker.datatype.boolean(),
      seller: true,
    });
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
