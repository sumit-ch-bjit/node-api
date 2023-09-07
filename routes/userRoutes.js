const express = require("express");
const router = express.Router();
const { userOrders } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { userValidator } = require("../middleware/validatorMiddleware");

router.get("/:id/orders", protect, userOrders);

module.exports = router;
