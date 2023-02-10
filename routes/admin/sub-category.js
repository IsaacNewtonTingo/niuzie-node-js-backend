const express = require("express");
const {
  addSubCategory,
  deleteSubCategory,
  getCategorySubCategories,
  getSubCategoryProducts,
} = require("../../controller/admin/sub-category");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/add-sub-category/:id", access, addSubCategory);
router.delete("/delete-sub-category/:id", access, deleteSubCategory);
router.get("/get-sub-categories/:id", getCategorySubCategories);
router.get("/get-sub-category-products", getSubCategoryProducts);

module.exports = router;
