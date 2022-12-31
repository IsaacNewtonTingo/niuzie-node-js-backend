const express = require("express");
const {
  postProduct,
  checkNumberOfProducts,
  rateProduct,
  deleteProductReview,
  getProductReviews,
} = require("../controller/products");

const router = express.Router();

router.post("/post-product", postProduct);
router.get("/get-number/:id", checkNumberOfProducts);
router.post("/review-product/:id", rateProduct);
router.delete("/delete-product-review/:id", deleteProductReview);
router.get("/get-product-reviews/:id", getProductReviews);

module.exports = router;
