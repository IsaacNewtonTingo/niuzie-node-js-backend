exports.storeMessage = async (req, res) => {
  try {
    const { messageID, chat, content, image } = req.body;
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while",
    });
  }
};
