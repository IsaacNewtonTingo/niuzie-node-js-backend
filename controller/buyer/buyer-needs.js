const { BuyerNeed } = require("../../models/buyer/buyer-needs");
const User = require("../../models/general/user");

exports.postNeed = async (req, res) => {
  try {
    const { userID, content } = req.body;
    if (!content) {
      res.json({
        status: "Failed",
        message: "Please add you're looking for",
      });
    } else {
      const newBuyerNeed = new BuyerNeed({
        user: userID,
        content,
      });

      await newBuyerNeed.save();
      res.json({
        status: "Success",
        message: "Posted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while posting your need",
    });
  }
};

exports.deleteNeed = async (req, res) => {
  try {
    const { userID } = req.query;
    const needID = req.params.id;

    const need = await BuyerNeed.findOneAndDelete({
      $and: [{ user: userID }, { _id: needID }],
    });
    if (need) {
      res.json({
        status: "Success",
        message: "Deleted successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "Post already deleted",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while deleting your post",
    });
  }
};

exports.editNeed = async (req, res) => {
  try {
    const { userID, content } = req.body;
    const needID = req.params.id;

    const need = await BuyerNeed.findOneAndUpdate(
      {
        $and: [{ user: userID }, { _id: needID }],
      },
      {
        content,
      }
    );
    if (need) {
      res.json({
        status: "Success",
        message: "Updated successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating your post",
    });
  }
};

exports.getAllNeeds = async (req, res) => {
  try {
    let {
      pageNumber = 0,
      limit = 20,
      searchTerm,
      createdAt = -1,
      county,
      subCounty,
    } = req.query;

    sort = {
      createdAt,
    };

    searchTerm = searchTerm ? searchTerm.trim() : "";

    const list = await BuyerNeed.find({
      content: { $regex: searchTerm, $options: "i" },
    })
      .populate({
        path: "user",
        select:
          "firstName lastName phoneNumber email profilePicture county subCounty",
      })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(pageNumber) * parseInt(limit));
    //if there is search term, query according to that

    if (county && !subCounty) {
      const filtered = list.filter((need) => need.user.county == county);

      res.json({
        status: "Success",
        message: "Users needs retrieved successfully",
        data: filtered,
      });
    } else if (county && subCounty) {
      const filtered = list.filter(
        (need) => need.user.county == county && need.user.subCounty == subCounty
      );

      res.json({
        status: "Success",
        message: "Users needs retrieved successfully",
        data: filtered,
      });
    } else {
      res.json({
        status: "Success",
        message: "Users needs retrieved successfully",
        data: list,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting buyer needs",
    });
  }
};

exports.getOneNeed = async (req, res) => {
  try {
    const needID = req.params.id;
    const { userID } = req.body;
    const user = await User.findOne({ _id: userID });

    if (user.premium == true) {
      const need = await BuyerNeed.findOne({ _id: userID });
      res.json({
        status: "Success",
        message: "Data retrieved successfully",
        data: need,
      });
    } else {
      res.json({
        status: "Failed",
        message: "You don't have permission to view this data",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while retrieving data",
    });
  }
};

exports.searchNeeds = async (req, res) => {
  try {
    var { searchTerm } = req.query;
    searchTerm = searchTerm.trim();

    const searchResult = await BuyerNeed.find({
      content: { $regex: searchTerm, $options: "i" },
    }).populate("user", "firstName lastName phoneNumber profilePicture");

    res.json({
      status: "Success",
      message: "Users needs retrieved successfully",
      data: searchResult,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while searching",
    });
  }
};

exports.getUserNeeds = async (req, res) => {
  try {
    const userID = req.params.id;
    const needs = await BuyerNeed.find({ user: userID }).sort({
      createdAt: -1,
    });

    res.json({
      status: "Success",
      message: "Users needs retrieved successfully",
      data: needs,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting user needs",
    });
  }
};
