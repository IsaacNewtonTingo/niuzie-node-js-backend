const CategoryNotification = require("../../models/general/category-notifications");
const { Notification } = require("../../models/general/notifications");
const User = require("../../models/general/user");

const { Product } = require("../../models/seller/products");
const { sendNotification } = require("../../helpers/notification");
const { DeviceToken } = require("../../models/general/device-token");

exports.approveProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const { userID } = req.query;

    //check if user has rights
    const user = await User.findOne({ _id: userID });

    if (user?.admin !== true) {
      res.json({
        status: "Failed",
        message: "Anuthorized operation",
      });
    } else {
      const product = await Product.findOne(
        { _id: productID },
        "-paid -expiryDate -expiryNotificationDate -tenDayExpirationEmailSent"
      )
        .populate({
          path: "user",
          select:
            "firstName lastName phoneNumber profilePicture county subCounty premium",
        })
        .populate({ path: "category" });

      if (product) {
        const productName = product.productName;
        const productOwnerID = product.user;
        const category = product.category._id;
        const categoryName = product.category.categoryName;

        if (product.verified == false) {
          await product.updateOne({
            verified: true,
            active: true,
            reviewed: true,
          });

          //create notification to that specific user
          const newNotification = new Notification({
            user: productOwnerID,
            notificationCategory: "Product approval",
            product,
            title: "Product approved",
            message: `Hello, your product (${productName}) has been successfully approved`,
            image: null,
            read: false,
          });

          await newNotification.save();
          //push the notification---------------------------------------------------------

          let savedPushTokens = await DeviceToken.find({
            $and: [{ user: userID }, { active: true }],
          });

          const notificationTitle = "Product approved";
          const notificationBody = `Hello, your product (${productName}) has been successfully approved`;
          sendNotification(
            savedPushTokens,
            notificationTitle,
            notificationBody
          );

          //notification for all user who have subscribed to a category
          //first find the users
          const categorySubscribers = await CategoryNotification.find({
            category,
          });

          //send notifs
          if (categorySubscribers.length > 0) {
            const newCategoryNotif = categorySubscribers.map((obj) => ({
              user: obj.user,
              notificationCategory: "New product in category",
              product,
              title: "New product posted",
              message: `Hello, new product has been posted ot the category ${categoryName}`,
              image: null,
              read: false,
            }));

            await Notification.insertMany(newCategoryNotif);
            //send push notifications to this users--------------------------------------------
            sendNotification(1, 2);

            res.json({
              status: "Success",
              message: "Product successfully approved",
            });
          }
        } else {
          //create notification
          await product.updateOne({
            verified: false,
            active: false,
            reviewed: true,
          });

          const newNotification = new Notification({
            user: productOwnerID,
            notificationCategory: "Product approval",
            product,
            title: "Product disapproved",
            message: `Hello, your product (${productName}) has been disapproved`,
            image: null,
            read: false,
          });

          await newNotification.save();

          //send push notification------------------------------------------------------------
          sendNotification(1, 2);

          res.json({
            status: "Success",
            message: "Product successfully disapproved",
          });
        }
      } else {
        res.json({
          status: "Failed",
          message: "Product not found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while updating product",
    });
  }
};

//get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: "user",
        select: "firstName lastName phoneNumber premium county subCounty",
      })
      .populate("category")
      .populate("subCategory");
    res.json({
      status: "Success",
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: "An error occured while getting products",
      data: error,
    });
  }
};
//get all users
