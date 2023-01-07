const express = require("express");
const {
  addSubCategory,
  deleteSubCategory,
  getCategorySubCategories,
  getSubCategoryProducts,
} = require("../../controller/admin/sub-category");

const router = express.Router();

router.post("/add-sub-category", addSubCategory);
router.delete("/delete-sub-category/:id", deleteSubCategory);
router.get("/get-sub-categories", getCategorySubCategories);
router.get("/get-sub-category-products", getSubCategoryProducts);

module.exports = router;
