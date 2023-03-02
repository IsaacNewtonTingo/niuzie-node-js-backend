const { openai } = require("../../config/chatjulie/open-ai");

exports.textCompletion = async (req, res) => {
  const { messages, user } = req.body;
  const temperature = 0.5;
  const model = "gpt-3.5-turbo";

  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
    });
    // Return the generated text as a response
    res.json({
      status: "Sucess",
      message: "Successfully completed text",
      data: response.data.choices,
      temperature,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
