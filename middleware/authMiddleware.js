const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const HTTP_STATUS = require("../constants/statusCodes");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const isAuthorized = asyncHandler(async (req, res, next) => {
  try {
    if (
      !req.headers.authorization &&
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json("unauthorized access");
    }

    const token = req.headers.authorization.split(" ")[1];
    const validate = jwt.verify(token, process.env.JWT_SECRET);

    if (validate) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Token invalid" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Token Expired" });
    }

    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Please Log in Again" });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "unauthorized access" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const validate = jwt.decode(token, process.env.JWT_SECRET);

    if (validate && validate.role === "admin") {
      next();
    } else {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Error Adding Product" });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Token invalid" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Credentials expired, log in again" });
    }

    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Please log in again" });
  }
});

const lockAccountIfThresholdReached = async (req, res, next) => {
  const { username } = req.body; // Assuming you have the username in the request

  try {
    const user = await User.findOne({ username });

    // Check if the user exists and the account is not already locked
    if (user && !user.isLocked) {
      // Increment the failed login attempts
      user.failedLoginAttempts += 1;

      // Check if the user has exceeded the allowed login attempts
      if (user.failedLoginAttempts >= 5) {
        // Lock the account for 10 minutes
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
      }

      // Save the user document
      await user.save();
    }

    // Continue processing the login attempt
    next();
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  protect,
  isAuthorized,
  isAdmin,
  lockAccountIfThresholdReached,
};
