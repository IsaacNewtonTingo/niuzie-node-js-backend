const { Chat } = require("../models/chat");
const { Message } = require("../models/message");

exports.createChat = async (req, res) => {
  try {
    const { messageID, user, content, chatName, chatID, image } = req.body;

    const existingChat = await Chat.findOne({ chatID });
    if (existingChat) {
      //add the messages
      await Message.create({
        messageID,
        user,
        chat: existingChat._id,
        content,
        image,
      });

      res.json({
        status: "Sucess",
        message: "Message stored successfully",
      });
    } else {
      //create chat then add message
      const newChat = await Chat.create({
        chatID,
        chatName,
      });

      await Message.create({
        messageID,
        user,
        chat: newChat._id,
        content,
        image,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while saving message",
    });
  }
};
