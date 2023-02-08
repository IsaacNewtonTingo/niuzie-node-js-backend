const express = require("express");
const { storeToken } = require("../../controller/general/device-token");
const {
  getNotifications,
  readNotif,
  readAllNotifications,
} = require("../../controller/general/notification");
const {
  signup,
  verifyCode,
  login,
  getUser,
  getMyPayments,
  sendForgotPasswordOtp,
  verifyForgotPassOtp,
  changePassword,
} = require("../../controller/general/user");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/send-reset-pass-otp", sendForgotPasswordOtp);
router.post("/change-password", changePassword);
router.get("/get-user-data/:id", access, getUser);
router.get("/get-user-payments/:id", access, getMyPayments);
router.get("/get-notifications/:id", access, getNotifications);
router.put("/read-notification/:id", access, readNotif);
router.put("/read-all-notifications/:id", access, readAllNotifications);
router.post("/store-device-token", access, storeToken);

module.exports = router;
