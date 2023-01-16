const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactUsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
  },
  { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", ContactUsSchema);
module.exports = ContactUs;
