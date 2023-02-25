const express = require("express");

const { addAdmin } = require("../../controller/admin/users");

const access = require("../../middleware/jwt");

const router = express.Router();

router.put("/set-admin/:id", access, addAdmin);

module.exports = router;
