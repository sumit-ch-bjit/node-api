const Item = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const getAllItem = asyncHandler(async (req, res) => {
  const items = await Item.getAllItems();
  res.status(200).json(items);
});

const createItem = asyncHandler(async (req, res) => {
  if (!req.body.id || !req.body.name) {
    res.status(400);
    throw new Error("add a product id and name");
  }

  await Item.addProduct(req.body);

  res.status(200).json({ message: "item successfully added" });
});

const getOneItem = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const item = await Item.findItem(id);

  // console.log(item);

  if (item.length === 0) {
    res.status(400);
    throw new Error("item not found");
  }
  res.status(200).json(item);
});

const updateItem = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const item = await Item.findItem(id);

  if (item.length === 0) {
    res.status(400);
    throw new Error("item not found");
  }

  await Item.findByIdAndUpdate(id, req.body);
  res.status(200).json({ message: "updated the product" });
});

const deleteItem = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const item = await Item.findItem(id);

  if (item.length === 0) {
    res.status(400);
    throw new Error("item not found");
  }

  await Item.findByIdAndDelete(id, req.body);
  res.status(200).json({ message: "deleted the product" });
});

module.exports = {
  getAllItem,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
};
