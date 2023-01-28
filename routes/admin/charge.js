const express = require("express");
const {
  createCharge,
  getCharge,
  getOneCharge,
  editCharge,
} = require("../../controller/admin/charges");

const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/add-charge", access, createCharge);
router.get("/get-charges", access, getCharge);
router.get("/get-charge/:id", access, getOneCharge);
router.put("/edit-charge/:id", access, editCharge);

module.exports = router;
