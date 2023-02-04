const express = require("express");
const { getMessages } = require("../../controller/admin/contact-us");
const router = express.Router();

const access = require("../../middleware/jwt");

router.get("/get-messages/:id", access, getMessages);

module.exports = router;
