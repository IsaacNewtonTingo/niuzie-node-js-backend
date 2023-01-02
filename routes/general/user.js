const express = require("express");
const {
  signup,
  verifyCode,
  login,
  verifyEmail,
} = require("../../controller/general/user");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

module.exports = router;
