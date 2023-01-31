const { Notification } = require("../../models/general/notifications");
const User = require("../../models/general/user");

exports.getNotifications = async (req, res) => {
  try {
    const userID = req.params.id;

    const user = await User.findOne({ _id: userID });
    if (user) {
      //user found get their notifications
      const notifications = await Notification.find({
        user: userID,
      })
        .populate({
          path: "product",
          select:
            "user productName condition description price rating image1 image2 image3 image4 promoted",
          populate: {
            path: "user",
            select:
              "firstName lastName phoneNumber profilePicture county subCounty premium admin",
          },
        })
        .sort({ createdAt: -1 });

      res.json({
        status: "Success",
        message: "Notifications retrieved successfully",
        data: notifications,
      });
    } else {
      res.json({
        status: "Failed",
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting user notifications",
    });
  }
};
