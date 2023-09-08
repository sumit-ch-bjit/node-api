const express = require("express");
const router = express.Router();

const { addToCart, removeFromCart } = require("../controllers/cartController");
const { cartValidator } = require("../middleware/validatorMiddleware");

router.route("/add-to-cart").post(cartValidator.addItemToCart, addToCart);
router
  .route("/remove-from-cart")
  .post(cartValidator.removeFromCart, removeFromCart);

module.exports = router;
