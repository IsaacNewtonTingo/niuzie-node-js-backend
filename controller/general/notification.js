const { Notification } = require("../../models/general/notifications");
const User = require("../../models/general/user");

//get notis
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
            "user category subCategory productName condition description price rating image1 image2 image3 image4 promoted",
          populate: [
            {
              path: "user",
              select:
                "firstName lastName phoneNumber profilePicture county subCounty premium admin",
            },
            { path: "category", select: "categoryName" },
            { path: "subCategory", select: "subCategoryName" },
          ],
        })

        .sort({ createdAt: -1 });

      const unreadNotfis = notifications.filter(
        (notification) => !notification.read
      );

      res.json({
        status: "Success",
        message: "Notifications retrieved successfully",
        data: {
          notifications,
          unread: unreadNotfis.length,
        },
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

//edit state
exports.readNotif = async (req, res) => {
  try {
    const { userID } = req.query;
    const notificationID = req.params.id;

    await Notification.findOneAndUpdate(
      {
        $and: [{ user: userID }, { _id: notificationID }],
      },
      { read: true }
    );

    res.json({
      status: "Success",
      message: "Read successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating notification",
    });
  }
};

//read all
exports.readAllNotifications = async (req, res) => {
  try {
    const userID = req.params.id;

    await Notification.updateMany({ user: userID }, { read: true });

    res.json({
      status: "Success",
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating notification",
    });
  }
};
