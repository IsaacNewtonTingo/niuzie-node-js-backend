const express = require("express");
const { joinPremium } = require("../../controller/general/join-premium");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/join-premium", access, joinPremium);

module.exports = router;
