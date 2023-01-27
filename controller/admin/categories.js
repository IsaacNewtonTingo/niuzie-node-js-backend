const { Category } = require("../../models/admin/categories");
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

//delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryID = req.params.id;
    //check if category already exists

    const category = await Category.findOneAndDelete({ _id: categoryID });
    console.log(category);
    if (category) {
      res.json({
        status: "Success",
        message: "Category deleted successfully",
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
      .populate("user")
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
