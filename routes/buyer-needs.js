const express = require("express");
const {
  postNeed,
  editNeed,
  deleteNeed,
  getOneNeed,
  getAllNeeds,
  searchNeeds,
} = require("../controller/buyer-needs");
const router = express.Router();

router.post("/post-need", postNeed);
router.put("/edit-need/:id", editNeed);
router.delete("/delete-need/:id", deleteNeed);
router.get("/get-one-need/:id", getOneNeed);
router.get("/get-all-needs", getAllNeeds);
router.get("/search-needs", searchNeeds);

module.exports = router;
