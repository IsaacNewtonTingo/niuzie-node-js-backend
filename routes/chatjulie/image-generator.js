const express = require("express");
const router = express.Router();

const { imageGenerator } = require("../controller/image-generation");

router.post("/generate-image", imageGenerator);

module.exports = router;
