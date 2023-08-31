const express = require("express");
const router = express.Router();

const {
  getAllItem,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/productController");

const {
  productValidator,
  productUpdateValidator,
} = require("../middleware/validatorMiddleware");

router.route("/").get(getAllItem).post(productValidator.create, createItem);

router
  .route("/:id")
  .patch(productUpdateValidator.create, updateItem)
  .delete(deleteItem)
  .get(getOneItem);

module.exports = router;
