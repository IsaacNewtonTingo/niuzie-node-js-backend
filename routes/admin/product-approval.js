const express = require("express");
const router = express.Router();

const access = require("../../middleware/jwt");

const { approveProduct } = require("../../controller/admin/products-approval");

router.put("/approve-product/:id", access, approveProduct);

module.exports = router;
