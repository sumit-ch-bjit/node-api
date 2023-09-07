const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Auth = require("../models/authModel");
const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");

//  @desc   Register new user
//  @route  POST /api/auth/sign-up
//  @access public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req).array();
    if (errors.length === 0) {
      const { username, email, password, role, firstName, lastName, address } =
        req.body;

      // console.log(req.body);
      // Check if the user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Username or email already taken" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        username,
        email,
        firstName,
        lastName,
        address,
      });

      // Save the user to the database
      const user = await newUser.save();

      const userId = user._id;

      const newAuth = new Auth({
        user: userId,
        username,
        email,
        password: hashedPassword,
        role,
      });

      await newAuth.save();

      res
        .status(HTTP_STATUS.CREATED)
        .json({ message: "User registered successfully", newUser });
    } else {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .json({ message: "invalid input provided", errors });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "internal server error" });
  }
});

//  @desc   Authenticate a user
//  @route  POST /api/auth/login
//  @access public
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   //check for user email
//   const userAuth = await Auth.findOne({ email }).populate("user");

//   // console.log({ ...userAuth });

//   const userProfile = {
//     _id: userAuth._id,
//     username: userAuth.username,
//     role: userAuth.role,
//     firstName: userAuth.user.firstName,
//     lastName: userAuth.user.lastName,
//     address: userAuth.user.address,
//   };

//   if (userAuth && (await bcrypt.compare(password, userAuth.password))) {
//     res.json({
//       userProfile,
//       token: generateToken(userProfile),
//       // token: generateToken(userAuth._id),// we can generate id with the whole object
//       // to be done later
//     });
//   } else {
//     res.status(HTTP_STATUS.BAD_REQUEST);
//     throw new Error("Invalid user credentials");
//   }
// });

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user based on the provided email
  const userAuth = await Auth.findOne({ email }).populate("user");

  // Check if the user exists and the account is not locked
  if (userAuth) {
    if (userAuth.isLocked && userAuth.lockUntil > Date.now()) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: "Account is locked. try again later" });
    }
    // Check if the account is locked
    if (userAuth.failedLoginAttempts >= 5) {
      userAuth.isLocked = true;
      userAuth.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
      await userAuth.save();
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message:
          "You've tried to log in too many times. Account is being locked",
      });
    }

    // Check the provided password
    const isPasswordValid = await bcrypt.compare(password, userAuth.password);

    if (isPasswordValid) {
      // Reset failedLoginAttempts on successful login
      userAuth.failedLoginAttempts = 0;
      userAuth.isLocked = false;
      await userAuth.save();

      const userProfile = {
        _id: userAuth._id,
        username: userAuth.username,
        role: userAuth.role,
        firstName: userAuth.user.firstName,
        lastName: userAuth.user.lastName,
        address: userAuth.user.address,
      };

      res.json({
        message: "logged in successfully",
        userProfile,
        token: generateToken(userProfile),
      });
    } else {
      // Increment failedLoginAttempts on failed login
      userAuth.failedLoginAttempts += 1;
      await userAuth.save();

      res.status(HTTP_STATUS.BAD_REQUEST).json("Invalid user credentials");
    }
  } else {
    res.status(HTTP_STATUS.NOT_FOUND).json("User not found");
  }
});

const generateToken = (userProfile) => {
  return jwt.sign(userProfile, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { registerUser, loginUser };
