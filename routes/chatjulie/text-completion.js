const express = require("express");
const {
  textCompletion,
} = require("../../controller/chatjulie/text-completion");
const router = express.Router();

router.post("/text-completion", textCompletion);

module.exports = router;
