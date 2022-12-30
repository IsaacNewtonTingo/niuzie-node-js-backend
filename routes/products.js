const express = require("express");
const { postProduct } = require("../controller/products");

const router = express.Router();

router.post("/post-product", postProduct);

module.exports = router;
