const express = require("express");
const router = express.Router();

const access = require("../../middleware/jwt");

const {
  approveProduct,
  getAllProducts,
} = require("../../controller/admin/products");

router.put("/approve-product/:id", access, approveProduct);
router.get("/get-products", access, getAllProducts);

module.exports = router;
