const Item = require("../models/productModel");

const productValidator = (req, res, next) => {
  const { id, name, description, price } = req.body;
  const error = {};
  if (!id) {
    error.id = "id is missing";
  }
  if (!name) {
    error.name = "name is missing";
  }
  if (!description) {
    error.description = "descrtiption is missing";
  }
  if (!price || price < 100) {
    error.price = "price is missing or less than 100";
  }

  if (Object.keys(error).length !== 0) {
    res.status(400).json({ message: "mandatory fields are missing", error });
  } else {
    next();
  }
};

module.exports = { productValidator };
