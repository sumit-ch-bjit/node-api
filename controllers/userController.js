const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const { validationResult } = require("express-validator");

//  @desc   Register new user
//  @route  POST /api/users
//  @access public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req).array();
    if (errors.length === 0) {
      const { username, email, password, firstName, lastName, address } =
        req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already taken" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        address,
      });

      // Save the user to the database
      await newUser.save();

      res
        .status(201)
        .json({ message: "User registered successfully", newUser });
    } else {
      return res
        .status(422)
        .json({ message: "invalid input provided", errors });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//  @desc   Authenticate a user
//  @route  POST /api/users/login
//  @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user credentials");
  }
});

//  @desc   Get user data
//  @route  POST /api/users/me
//  @access Private
// const getMe = asyncHandler(async (req, res) => {
//   const { _id, name, email } = await User.findById(req.user.id);

//   res.status(200).json({
//     id: _id,
//     name,
//     email,
//   });
// });

//generate JWt

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const userOrders = asyncHandler(async (req, res) => {
  // console.log("id", req.params.id);
  try {
    const id = req.params.id;
    // console.log(id);

    await Order.find({ user: id })
      .populate("user", "-password")
      .populate("products.product")
      .then((order) => {
        return res.status(200).json({ message: "orders by the user", order });
      })
      .catch((error) => {
        return res
          .status(400)
          .json({ message: "no order found by the user", error });
      });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }

  // return res.status(200).json({ message: "users orders foound" });
  // const ordersByUser = await Order.getUserOrders(req.params.id);
  // if (ordersByUser.length === 0) {
  //   res.status(200).json({ message: "no orders by the user" });
  // } else {
  //   res.status(200).json({ orders: ordersByUser });
  // }
});

module.exports = { registerUser, loginUser, userOrders };
