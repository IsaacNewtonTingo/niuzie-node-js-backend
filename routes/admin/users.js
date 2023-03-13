const express = require("express");

const {
  addAdmin,
  removeAdmin,
  getAdmins,
} = require("../../controller/admin/users");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/add-admin/:id", access, addAdmin);
router.get("/get-admins", access, getAdmins);
router.delete("/remove-admin/:id", access, removeAdmin);

module.exports = router;
