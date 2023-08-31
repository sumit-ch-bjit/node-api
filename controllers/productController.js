const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

const getAllItem = asyncHandler(async (req, res) => {
  try {
    const items = await Product.find();
    if (items.length === 0) {
      res.status(200).json({ message: "no item found" });
    } else {
      res.status(200).json({ message: "all items", items });
    }
  } catch (error) {
    throw new Error("internal server error");
  }
});

const createItem = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req).array();
    // console.log(errors);
    if (errors.length === 0) {
      const { name, description, price, imageUrl, category, inStock } =
        req.body;

      const newProduct = new Product({
        name,
        description,
        price,
        imageUrl,
        category,
        inStock,
      });

      await newProduct
        .save()
        .then((product) => {
          return res
            .status(201)
            .json({ message: "product creation successful", product });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ message: "could not create product", err });
        });
    } else {
      return res
        .status(400)
        .json({ message: "invalid inputs provided", errors });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

const getOneItem = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    await Product.findById(id)
      .then((product) => {
        return res.status(200).json({ message: "product found", product });
      })
      .catch((error) => {
        return res.status(404).json({ message: "product not found", error });
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }); // Updated HTTP status to 500 (Internal Server Error)
  }
});

const updateItem = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req).array();
    if (errors.length === 0) {
      const id = req.params.id;

      await Product.findByIdAndUpdate(id, req.body, { new: true })
        .then((product) => {
          res.status(200).json({ message: "product updated", product });
        })
        .catch((error) => {
          res.status(400).json({ message: "could not find product", error });
        });
    } else {
      return res
        .status(400)
        .json({ message: "invalid inputs provided", errors });
    }
  } catch (error) {
    res.status(400);
    throw new Error("Internal server error");
  }
});

const deleteItem = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Product.findById(id);

    if (deletedItem) {
      res
        .status(200)
        .json({ message: "item deleted successfully", deletedItem });
    } else {
      res.status(404).json({ message: "item not found" });
    }
  } catch (error) {
    throw new Error("an error occured");
  }
});

module.exports = {
  getAllItem,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
};
