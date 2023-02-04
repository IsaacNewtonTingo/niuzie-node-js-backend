const express = require("express");
const {
  getMessages,
  readMessage,
} = require("../../controller/admin/contact-us");
const router = express.Router();

const access = require("../../middleware/jwt");

router.get("/get-messages/:id", access, getMessages);
router.put("/read-message/:id", access, readMessage);

module.exports = router;
