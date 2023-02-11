const { Product } = require("../../models/seller/products");
const { SubCategory } = require("../../models/admin/sub-category");
const User = require("../../models/general/user");

exports.addSubCategory = async (req, res) => {
  try {
    const category = req.params.id;
    const { subCategoryName, userID } = req.body;

    //check user
    const user = await User.findOne({ _id: userID });
    if (user.admin == true) {
      //check if subcategory already exists
      const subCategory = await SubCategory.findOne({ subCategoryName });
      if (subCategory) {
        res.json({
          status: "Failed",
          message: "Subcategory with the given name already exists",
        });
      } else {
        const newSubCategory = new SubCategory({
          subCategoryName,
          category,
        });

        await newSubCategory.save();
        res.json({
          status: "Success",
          message: "Sub category added successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Anauthorized operation",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while adding sub category",
    });
  }
};

//delete sub category
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategoryID = req.params.id;
    const { userID } = req.query;

    //check user
    const user = await User.findOne({ _id: userID });
    if (user.admin == true) {
      //check if subcategory already exists

      const subCategory = await SubCategory.findOneAndDelete({
        _id: subCategoryID,
      });
      if (subCategory) {
        res.json({
          status: "Success",
          message: "Sub category deleted successfully",
        });
      } else {
        res.json({
          status: "Failed",
          message: "Sub category doesn't exist",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Anauthorized operation",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while deleting sub category",
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const subCategoryID = req.params.id;
    const { userID, subCategoryName } = req.body;

    //check user
    const user = await User.findOne({ _id: userID });
    if (user.admin == true) {
      //check if subcategory already exists

      const subCategory = await SubCategory.findOneAndUpdate(
        {
          _id: subCategoryID,
        },
        { subCategoryName }
      );
      if (subCategory) {
        res.json({
          status: "Success",
          message: "Sub category updated successfully",
        });
      } else {
        res.json({
          status: "Failed",
          message: "Sub category doesn't exist",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Anauthorized operation",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while deleting sub category",
    });
  }
};

//get all sub categories of a category
exports.getCategorySubCategories = async (req, res) => {
  try {
    const categoryID = req.params.id;

    const subCategories = await SubCategory.find({ category: categoryID }).sort(
      {
        subCategoryName: 1,
      }
    );
    res.json({
      status: "Success",
      message: "Sub categories retrieved successfully",
      data: subCategories,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting sub categories",
    });
  }
};

//get products of a category
exports.getSubCategoryProducts = async (req, res) => {
  try {
    const subCategoryID = req.params.id;
    const products = await Product.find({ subCategory: subCategoryID });
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
