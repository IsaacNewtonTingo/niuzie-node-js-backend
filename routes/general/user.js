const express = require("express");
const {
  signup,
  verifyCode,
  login,
  verifyEmail,
  getUser,
} = require("../../controller/general/user");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", access, verifyCode);
router.post("/login", login);
router.post("/verify-email", access, verifyEmail);
router.get("/get-user-data/:id", access, getUser);
router.get("/get-user-payments/:id", access, getUser);

module.exports = router;
