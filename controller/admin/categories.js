const { Category } = require("../../models/admin/categories");
const { SubCategory } = require("../../models/admin/sub-category");
const SaveProduct = require("../../models/general/save-product");
const { Product } = require("../../models/seller/products");

exports.addCategory = async (req, res) => {
  try {
    const { categoryName, categoryImage } = req.body;
    //check if category already exists

    const category = await Category.findOne({ categoryName });
    if (category) {
      res.json({
        status: "Failed",
        message: "Category with the given name already exists",
      });
    } else {
      const newCategory = new Category({
        categoryName,
        categoryImage,
      });

      await newCategory.save();
      res.json({
        status: "Success",
        message: "Category added successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while adding category",
    });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const { categoryName, categoryImage } = req.body;
    //check if category already exists

    const category = await Category.findOne({ _id: categoryID });
    if (!category) {
      res.json({
        status: "Failed",
        message: "Category not found",
      });
    } else {
      await category.updateOne({
        categoryName,
        categoryImage,
      });

      res.json({
        status: "Success",
        message: "Category updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while adding category",
    });
  }
};

//delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryID = req.params.id;
    //check if category already exists

    const category = await Category.findOneAndDelete({ _id: categoryID });
    //deleteSubcategories

    await SubCategory.deleteMany({ category: categoryID });
    //delete all products in that category
    // await Product.deleteMany({ category: categoryID });
    // //deletre all saved products
    // const savedProducts=SaveProduct.find({})
    if (category) {
      res.json({
        status: "Success",
        message:
          "Category deleted successfully. All products that belonged to this category have also been deleted",
      });
    } else {
      res.json({
        status: "Failed",
        message: "Category doesn't exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while adding category",
    });
  }
};

//get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ categoryName: 1 });
    res.json({
      status: "Success",
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting categories",
    });
  }
};

//get products of a category
exports.getCategoryProducts = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const products = await Product.find({
      $and: [{ category: categoryID }, { active: true }],
    })
      .populate("user", "-password -seller -admin")
      .populate("category", "categoryName")
      .populate("subCategory", "subCategoryName")
      .limit(20);
    res.json({
      status: "Success",
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting products",
    });
  }
};
