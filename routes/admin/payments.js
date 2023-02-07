const express = require("express");
const { getRevenue } = require("../../controller/admin/payments");
const router = express.Router();

const access = require("../../middleware/jwt");

router.get("/get-revenue/:id", access, getRevenue);

module.exports = router;
