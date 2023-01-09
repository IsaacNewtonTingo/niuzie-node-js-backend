const express = require("express");
const {
  signup,
  verifyCode,
  login,
  verifyEmail,
  getUser,
} = require("../../controller/general/user");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.get("/get-user-data/:id", getUser);

module.exports = router;
