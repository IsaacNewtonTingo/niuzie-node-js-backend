const express = require("express");
const {
  signup,
  verifyCode,
  login,
  verifyEmail,
  getUser,
  getMyPayments,
} = require("../../controller/general/user");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.get("/get-user-data/:id", access, getUser);
router.get("/get-user-payments/:id", access, getMyPayments);

module.exports = router;
