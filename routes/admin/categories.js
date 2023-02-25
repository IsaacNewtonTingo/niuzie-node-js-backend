const express = require("express");
const {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryProducts,
  editCategory,
} = require("../../controller/admin/categories");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/add-category", access, addCategory);
router.put("/edit-category/:id", access, editCategory);
router.delete("/delete-category/:id", access, deleteCategory);
router.get("/get-categories", getAllCategories);
router.get("/get-category-products/:id", getCategoryProducts);

module.exports = router;
