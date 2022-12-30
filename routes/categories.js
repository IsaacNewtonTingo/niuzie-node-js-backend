const express = require("express");
const {
  addCategory,
  deleteCategory,
  getAllCategories,
} = require("../controller/categories");

const router = express.Router();

router.post("/add-category", addCategory);
router.delete("/delete-category/:id", deleteCategory);
router.get("/get-categories", getAllCategories);

module.exports = router;
