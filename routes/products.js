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
} = require("../controller/products");

const router = express.Router();

router.post("/post-product", postProduct);
router.get("/get-number/:id", checkNumberOfProducts);
router.post("/review-product/:id", rateProduct);
router.delete("/delete-product-review/:id", deleteProductReview);
router.get("/get-product-reviews/:id", getProductReviews);
router.get("/get-all-products", getAllProducts);
router.get("/get-one-product/:id", getOneProduct);
router.delete("/delete-product/:id", deleteProduct);
router.put("/update-product/:id", updateProduct);

module.exports = router;
