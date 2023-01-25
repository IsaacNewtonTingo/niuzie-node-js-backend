const express = require("express");
const {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryProducts,
} = require("../../controller/admin/categories");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/add-category", access, addCategory);
router.delete("/delete-category/:id", access, deleteCategory);
router.get("/get-categories", access, getAllCategories);
router.get("/get-category-products/:id", getCategoryProducts);

module.exports = router;
