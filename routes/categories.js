const express = require("express");
const {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryProducts,
} = require("../controller/categories");

const router = express.Router();

router.post("/add-category", addCategory);
router.delete("/delete-category/:id", deleteCategory);
router.get("/get-categories", getAllCategories);
router.get("/get-category-products", getCategoryProducts);

module.exports = router;
