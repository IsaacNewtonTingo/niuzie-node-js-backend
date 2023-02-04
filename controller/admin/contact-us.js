const ContactUs = require("../../models/general/contact-us");
const User = require("../../models/general/user");

//get messages
exports.getMessages = async (req, res) => {
  const userID = req.params.id;

  try {
    const user = await User.findOne({ _id: userID });
    if (user.admin == true) {
      const messages = await ContactUs.find({}).populate({
        path: "user",
        select: "firstName lastName phoneNumber profilePicture",
      });
      res.json({
        status: "Success",
        message: "Messages retrieved successfully",
        data: messages,
      });
    } else {
      res.json({
        status: "Failed",
        message: "Anauthorized operation",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting messages",
    });
  }
};
