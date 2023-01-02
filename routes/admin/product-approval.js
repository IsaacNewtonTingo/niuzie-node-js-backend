const express = require("express");
const router = express.Router();

const { approveProduct } = require("../../controller/admin/products-approval");

router.put("/approve-product/:id", approveProduct);

module.exports = router;
