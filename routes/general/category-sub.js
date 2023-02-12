const express = require("express");
const router = express.Router();

const {
  subscribe,
  checkIfSubd,
} = require("../../controller/general/category-subscribers");

const access = require("../../middleware/jwt");

router.post("/subscribe/:id", access, subscribe);
router.post("/check-subscriber/:id", checkIfSubd);

module.exports = router;
