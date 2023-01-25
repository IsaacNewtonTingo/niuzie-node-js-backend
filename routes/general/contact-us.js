const express = require("express");
const { contactUs } = require("../../controller/general/contact-us");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/contact-us", access, contactUs);

module.exports = router;
