const express = require("express");
const {
  postProduct,
  checkNumberOfProducts,
} = require("../controller/products");

const router = express.Router();

router.post("/post-product", postProduct);
router.get("/get-number/:id", checkNumberOfProducts);

module.exports = router;
