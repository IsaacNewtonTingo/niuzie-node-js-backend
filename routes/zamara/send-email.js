const express = require("express");
const { sendZamaraEmail } = require("../../helpers/send-email");
const router = express.Router();

router.post("/send-zamara-email", sendZamaraEmail);

module.exports = router;
