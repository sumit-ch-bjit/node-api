const express = require("express");
const router = express.Router();
// const { orderValidator } = require("../middleware/validatorMiddleware");
const { postOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, postOrder);

module.exports = router;
