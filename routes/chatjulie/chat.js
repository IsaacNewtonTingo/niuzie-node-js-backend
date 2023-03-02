const express = require("express");
const { createChat } = require("../controller/chat");
const router = express.Router();

router.post("/create-chat", createChat);

module.exports = router;
