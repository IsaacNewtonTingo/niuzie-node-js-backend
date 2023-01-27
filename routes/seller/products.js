const express = require("express");
const {
  postProduct,
  checkNumberOfProducts,
  rateProduct,
  deleteProductReview,
  getProductReviews,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getOneProduct,
  getUserProducts,
  getPremiumUserProducts,
} = require("../../controller/seller/products");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/post-product", postProduct);
router.get("/get-all-products", getAllProducts);
router.get("/get-premium-user-products", getPremiumUserProducts);
router.get("/get-number/:id", access, checkNumberOfProducts);
router.post("/review-product/:id", access, rateProduct);
router.delete("/delete-product-review/:id", access, deleteProductReview);
router.get("/get-product-reviews/:id", getProductReviews);
router.get("/get-one-product/:id", getOneProduct);
router.get("/get-user-products/:id", getUserProducts);
router.delete("/delete-product/:id", access, deleteProduct);
router.put("/update-product/:id", access, updateProduct);

module.exports = router;
