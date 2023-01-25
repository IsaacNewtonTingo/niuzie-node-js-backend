const express = require("express");
const {
  postNeed,
  editNeed,
  deleteNeed,
  getOneNeed,
  getAllNeeds,
  searchNeeds,
} = require("../../controller/buyer/buyer-needs");
const access = require("../../middleware/jwt");

const router = express.Router();

router.post("/post-need", access, postNeed);
router.put("/edit-need/:id", access, editNeed);
router.delete("/delete-need/:id", access, deleteNeed);
router.get("/get-one-need/:id", getOneNeed);
router.get("/get-all-needs", getAllNeeds);
router.get("/search-needs", searchNeeds);

module.exports = router;
