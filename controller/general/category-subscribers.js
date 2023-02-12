const { Category } = require("../../models/admin/categories");
const CategorySubscribers = require("../../models/general/category-subscribers");

exports.checkIfSubd = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const { userID } = req.body;

    const exists = await Category.findOne({ _id: categoryID });

    if (exists) {
      const alreadySubd = await CategorySubscribers.findOne({
        $and: [{ user: userID }, { category: categoryID }],
      });
      if (alreadySubd) {
        res.json({
          status: "Success",
          message: "User is a subscriber",
          data: true,
        });
      } else {
        res.json({
          status: "Success",
          message: "User is not subscriber",
          data: false,
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Category not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while doing the check",
    });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const { userID } = req.body;

    //check if category exists
    const exists = await Category.findOne({ _id: categoryID });
    if (exists) {
      const alreadySubd = await CategorySubscribers.findOne({
        $and: [{ user: userID }, { category: categoryID }],
      });
      if (alreadySubd) {
        //unsub
        await alreadySubd.deleteOne();
        res.json({
          status: "Success",
          message: "Successfully unsubscribed from this category",
          data: false,
        });
      } else {
        await CategorySubscribers.create({
          user: userID,
          category: categoryID,
        });

        res.json({
          status: "Success",
          message: "Successfully subscribed to this category",
          data: true,
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Category not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while subscribing to this category",
    });
  }
};
