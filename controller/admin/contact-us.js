const ContactUs = require("../../models/general/contact-us");
const User = require("../../models/general/user");

//get messages
exports.getMessages = async (req, res) => {
  const userID = req.params.id;

  try {
    const user = await User.findOne({ _id: userID });
    if (user.admin == true) {
      const messages = await ContactUs.find({})
        .populate({
          path: "user",
          select: "firstName lastName phoneNumber profilePicture",
        })
        .sort({ createdAt: -1 });
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

//read msg
exports.readMessage = async (req, res) => {
  const { userID } = req.query;
  const messageID = req.params.id;

  try {
    const user = await User.findOne({ _id: userID });
    if (user.admin == true) {
      await ContactUs.findOneAndUpdate({ _id: messageID }, { read: true });

      res.json({
        status: "Success",
        message: "Messages read successfully",
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
      message: "An error occured updating message",
    });
  }
};
