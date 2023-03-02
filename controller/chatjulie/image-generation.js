const { openai } = require("../config/open-ai");

exports.imageGenerator = async (req, res) => {
  const { prompt } = req.body;

  try {
    const image = await openai.createImage({
      prompt,
      size: "1024x1024",
    });

    res.json({
      status: "Success",
      message: "Image generated successfully",
      data: image.data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while trying to generate image",
    });
  }
};
