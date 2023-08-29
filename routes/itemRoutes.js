const express = require("express");
const router = express.Router();

const {
  getAllItem,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemControllers");

const { productValidator } = require("../middleware/validatorMiddleware");

router.route("/").get(getAllItem).post(productValidator, createItem);

router
  .route("/:id")
  .patch(productValidator, updateItem)
  .delete(deleteItem)
  .get(getOneItem);

module.exports = router;
