const { Notification } = require("../../models/general/notifications");
const User = require("../../models/general/user");

const { Product } = require("../../models/seller/products");
const { sendNotification } = require("../../helpers/notification");
const { DeviceToken } = require("../../models/general/device-token");
const CategorySubscribers = require("../../models/general/category-subscribers");

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
            $and: [{ user: productOwnerID }, { active: true }],
          });

          const deviceTokens = savedPushTokens.map((token) => token.token);

          const notificationTitle = "Product approved";
          const notificationBody = `Hello, your product (${productName}) has been successfully approved`;

          sendNotification(
            deviceTokens,
            notificationTitle,
            notificationBody,
            product
          );

          //notification for all user who have subscribed to a category
          //first find the users
          const categorySubscribers = await CategorySubscribers.find({
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

            categorySubscribers.filter(async (catSubs) => {
              //get the users token
              const userToken = await DeviceToken.find({
                $and: [{ user: catSubs.user }, { active: true }],
              });

              const deviceTokens = userToken.map((token) => token.token);

              //send push notifications to these users----------------------------------

              const notificationTitle = "New product posted";
              const notificationBody = `Hello, new product has been posted ot the category ${categoryName}`;

              sendNotification(
                deviceTokens,
                notificationTitle,
                notificationBody,
                product
              );
            });
          }

          res.json({
            status: "Success",
            message: "Product successfully approved",
          });
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

          let savedPushTokens = await DeviceToken.find({
            $and: [{ user: productOwnerID }, { active: true }],
          });

          const deviceTokens = savedPushTokens.map((token) => token.token);

          const notificationTitle = "Product disapproved";
          const notificationBody = `Hello, your product (${productName}) has been disapproved`;

          sendNotification(
            deviceTokens,
            notificationTitle,
            notificationBody,
            product
          );

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

//reject
exports.rejectProduct = async (req, res) => {
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
          message: `Hello, your product (${productName}) has been rejected`,
          image: null,
          read: false,
        });

        await newNotification.save();

        //send push notification------------------------------------------------------------

        let savedPushTokens = await DeviceToken.find({
          $and: [{ user: productOwnerID }, { active: true }],
        });

        const deviceTokens = savedPushTokens.map((token) => token.token);

        const notificationTitle = "Product disapproved";
        const notificationBody = `Hello, your product (${productName}) has been disapproved`;

        sendNotification(
          deviceTokens,
          notificationTitle,
          notificationBody,
          product
        );

        res.json({
          status: "Success",
          message: "Product successfully rejected",
        });
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
exports.getNewProducts = async (req, res) => {
  var { pageNumber, limit } = req.query;
  try {
    const products = await Product.find({ reviewed: false })
      .sort({ createdAt: -1 })
      .skip(parseInt(limit) * parseInt(pageNumber))
      .limit(parseInt(limit))

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

//get approved
exports.getApprovedProducts = async (req, res) => {
  let { pageNumber = 0, limit = 20 } = req.query;
  try {
    const products = await Product.find({
      $and: [
        { reviewed: true },
        { verified: true },
        { active: true },
        { pending: false },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(limit) * parseInt(pageNumber))
      .limit(parseInt(limit))

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

//get rejected
exports.getRejectedProducts = async (req, res) => {
  let { pageNumber = 0, limit = 20 } = req.query;
  try {
    const products = await Product.find({
      $and: [
        { reviewed: true },
        { verified: false },
        { active: false },
        { pending: false },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(limit) * parseInt(pageNumber))
      .limit(parseInt(limit))

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
