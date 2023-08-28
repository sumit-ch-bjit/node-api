const registerUser = async (req, res) => {
  res.send(200).json("register user");
};

const loginUser = async (req, res) => {
  res.send(200).json("login user");
};

module.exports = { registerUser, loginUser };
