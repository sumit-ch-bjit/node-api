const express = require("express");
const router = express.Router();
// const { orderValidator } = require("../middleware/validatorMiddleware");
const { postOrder, getOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const {
  orderValidationRules,
  validateOrders,
} = require("../middleware/validatorMiddleware");

router
  .route("/")
  .post(protect, orderValidationRules(), validateOrders, postOrder);
router.route("/:id").get(protect, getOrder);

module.exports = router;
