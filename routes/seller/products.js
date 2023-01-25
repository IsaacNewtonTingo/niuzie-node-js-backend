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
} = require("../../controller/seller/products");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/post-product", postProduct);
router.get("/get-all-products", getAllProducts);
router.get("/get-number/:id", checkNumberOfProducts);
router.post("/review-product/:id", rateProduct);
router.delete("/delete-product-review/:id", deleteProductReview);
router.get("/get-product-reviews/:id", getProductReviews);
router.get("/get-one-product/:id", getOneProduct);
router.get("/get-user-products/:id", getUserProducts);
router.delete("/delete-product/:id", deleteProduct);
router.put("/update-product/:id", updateProduct);

module.exports = router;
