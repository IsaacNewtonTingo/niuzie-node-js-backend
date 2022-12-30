const express = require("express");
const { signup, verifyCode, login } = require("../controller/user");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", verifyCode);
router.post("/login", login);

module.exports = router;
