const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  // try {
  //   const { name, email, password } = req.body;

  //   if (!name || !email || !password) {
  //     res.status(400);
  //     throw new Error("please add all the fields");
  //   }

  //   const userExists = await User.findOne({ email });
  //   // console.log(userExists);
  //   res.status(200).json("register user");
  // } catch (error) {
  //   res.status(400);
  //   throw new Error("invalid user data");
  //   console.log(error);
  // }
  res.status(200).json("register user");
});

const loginUser = async (req, res) => {
  res.status(200).json("login user");
};

module.exports = { registerUser, loginUser };
