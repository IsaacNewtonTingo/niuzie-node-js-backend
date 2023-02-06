const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    profilePicture: String,
    county: String,
    subCounty: String,
    password: String,
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
      default: false,
    },
    acceptedTerms: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
