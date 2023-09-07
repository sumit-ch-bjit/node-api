const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { userValidator } = require("../middleware/validatorMiddleware");
const {
  lockAccountIfThresholdReached,
} = require("../middleware/authMiddleware");

router.route("/sign-up").post(userValidator.register, registerUser);
router.route("/login").post(loginUser);

module.exports = router;
