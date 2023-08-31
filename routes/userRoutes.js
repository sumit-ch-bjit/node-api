const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  userOrders,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { userValidator } = require("../middleware/validatorMiddleware");

router.post("/", userValidator.create, registerUser);
router.post("/login", loginUser);
router.get("/:id/orders", protect, userOrders);

module.exports = router;
