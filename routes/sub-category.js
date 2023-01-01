const express = require("express");
const {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoryProducts,
} = require("../controller/sub-category");

const router = express.Router();

router.post("/add-sub-category", addSubCategory);
router.delete("/delete-sub-category/:id", deleteSubCategory);
router.get("/get-sub-categories", getAllSubCategories);
router.get("/get-sub-category-products", getSubCategoryProducts);

module.exports = router;
