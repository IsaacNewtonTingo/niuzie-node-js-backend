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
  getPremiumUserProducts,
  getAllUserProducts,
  getActiveUserProducts,
  saveProduct,
  getSavedProducts,
  getOneSavedProduct,
  upload,
  getSellerProfile,
  submitProduct,
  removePendingProduct,
  getPendingProducts,
  publishManyProducts,
} = require("../../controller/seller/products");

const access = require("../../middleware/jwt");
const { makePayment } = require("../../middleware/make-payment");

const router = express.Router();

router.post("/upload", upload);
router.post("/submit-product", access, submitProduct);
router.put("/remove-product/:id", access, removePendingProduct);
router.get("/get-pending-products/:id", access, getPendingProducts);
router.post("/insert-many-products", access, makePayment, publishManyProducts);
router.post("/post-product", access, postProduct);
router.get("/get-all-products", getAllProducts);
router.get("/get-premium-user-products", getPremiumUserProducts);
router.get("/get-number/:id", access, checkNumberOfProducts);
router.post("/review-product/:id", access, rateProduct);
router.delete("/delete-product-review/:id", access, deleteProductReview);
router.get("/get-product-reviews/:id", getProductReviews);
router.get("/get-one-product/:id", getOneProduct);
router.get("/get-user-products/:id", getActiveUserProducts);
router.get("/get-all-user-products/:id", getAllUserProducts);
router.delete("/delete-product/:id", access, deleteProduct);
router.put("/update-product/:id", access, updateProduct);
router.post("/save-product/:id", access, saveProduct);
router.get("/get-saved-products/:id", access, getSavedProducts);
router.get("/get-one-saved-product/:id", access, getOneSavedProduct);
router.get("/get-seller-profile/:id", getSellerProfile);

module.exports = router;
