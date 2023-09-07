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

const { isAuthorized, isAdmin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getAllItem)
  .post(productValidator.create, isAuthorized, isAdmin, createItem);

router
  .route("/:id")
  .patch(productUpdateValidator.create, isAuthorized, isAdmin, updateItem)
  .delete(isAuthorized, isAdmin, deleteItem)
  .get(getOneItem);

module.exports = router;
