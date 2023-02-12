const express = require("express");
const router = express.Router();

const { subscribe } = require("../../controller/general/category-subscribers");

const access = require("../../middleware/jwt");

router.post("/subscribe/:id", access, subscribe);

module.exports = router;
