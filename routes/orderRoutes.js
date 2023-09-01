const express = require("express");
const router = express.Router();
// const { orderValidator } = require("../middleware/validatorMiddleware");
const {
  postOrder,
  getOrder,
  getAllOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(postOrder).get(getAllOrders);
router.route("/:id").get(getOrder);

module.exports = router;
