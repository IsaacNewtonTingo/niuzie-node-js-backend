const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    email: String,
    profilePicture: String,
    county: String,
    subCounty: String,
    password: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    endOfPremium: {
      type: Date,
      default: null,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
