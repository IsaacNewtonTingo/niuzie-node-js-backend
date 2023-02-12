const { Category } = require("../../models/admin/categories");
const CategorySubscribers = require("../../models/general/category-subscribers");

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
        });
      } else {
        await CategorySubscribers.create({
          user: userID,
          category: categoryID,
        });

        res.json({
          status: "Success",
          message: "Successfully subscribed to this category",
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
