const Item = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const getAllItem = asyncHandler(async (req, res) => {
  const items = await Item.getAllItems();
  if (items.length === 0) {
    res.status(200).json({ message: "no items in the products array" });
  } else {
    res.status(200).json(items);
  }
});

const createItem = asyncHandler(async (req, res) => {
  const item = req.body;
  await Item.addProduct(item);

  res.status(200).json({ message: "item successfully added", item });
});

const getOneItem = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const item = await Item.findItem(id);

  console.log(item);

  if (item.length === 0) {
    res.status(400);
    throw new Error("item not found");
  }
  res.status(200).json({ message: "item found", item });
});

const updateItem = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findItem(id);

    if (item.length === 0) {
      res.status(400);
      throw new Error("item not found");
    }

    const updatedItem = await Item.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "updated the product", updatedItem });
  } catch (error) {
    res.status(400);
    throw new Error("invalid request");
  }
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
