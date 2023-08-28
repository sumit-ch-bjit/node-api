const express = require("express");
const router = express.Router();

const {
  getAllItem,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemControllers");

router.route("/").get(getAllItem).post(createItem);
router.route("/:id").put(updateItem).delete(deleteItem).get(getOneItem);

module.exports = router;
