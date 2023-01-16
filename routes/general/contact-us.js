const express = require("express");
const { contactUs } = require("../../controller/general/contact-us");

const router = express.Router();

router.post("/contact-us", contactUs);

module.exports = router;
