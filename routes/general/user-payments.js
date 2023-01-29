const express = require("express");
const { getPayments } = require("../../controller/general/user-payments");

const access = require("../../middleware/jwt");

const router = express.Router();

router.get("/get-payments/:id", access, getPayments);

module.exports = router;
