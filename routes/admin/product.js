const express = require("express");
const router = express.Router();

const access = require("../../middleware/jwt");

const {
  approveProduct,
  getNewProducts,
  getApprovedProducts,
  getRejectedProducts,
  rejectProduct,
} = require("../../controller/admin/products");

router.put("/approve-product/:id", access, approveProduct);
router.put("/reject-product/:id", access, rejectProduct);
router.get("/get-new-products", access, getNewProducts);
router.get("/get-approved-products", access, getApprovedProducts);
router.get("/get-rejected-products", access, getRejectedProducts);

module.exports = router;
