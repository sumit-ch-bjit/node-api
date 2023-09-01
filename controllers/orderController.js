const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const postOrder = asyncHandler(async (req, res) => {
  try {
    const order = req.body;
    const { user, products } = order;

    const total = await calculateTotal(products);

    const newOrder = new Order({
      user,
      products,
      total: total,
    });

    await newOrder
      .save()
      .then((order) => {
        return res
          .status(200)
          .json({ message: "order created successfully", order });
      })
      .catch((error) => {
        return res
          .status(400)
          .json({ message: "could not add product", error });
      });
  } catch (error) {
    throw new Error("internal server error");
  }
});

const getOrder = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    await Order.findById(id)
      .populate("user", "-password -createdAt -updatedAt")
      .populate("products", "-imageUrl")
      .then((order) => {
        return res.status(200).json({ message: "order found", order });
      })
      .catch((error) => {
        return res.status(404).json({ message: "order not found", error });
      });
  } catch (error) {
    throw new Error("internal server error");
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    await Order.find()
      .populate("user", "-password")
      .populate("products.product")
      .then((order) => {
        return res.status(200).json({ message: "all orders", order });
      })
      .catch((error) => {
        return res.status(400).json({ message: "no orders found", error });
      });
  } catch (error) {
    throw new Error("internal server error");
  }
});

async function calculateTotal(products) {
  try {
    const productIDs = products.map((item) => item.product);

    const productQuantities = products.reduce((quantities, item) => {
      quantities[item.product] = item.quantity;
      return quantities;
    }, {});

    // console.log(productQuantities);

    const foundProducts = await Product.find({ _id: { $in: productIDs } });

    // console.log(foundProducts);

    let total = 0;

    foundProducts.forEach((product) => {
      const price = product.price;
      const quantity = productQuantities[product._id.toString()] || 0;
      total += price * quantity;
    });

    return total;
  } catch (error) {
    console.error("Error calculating total:", error);
    throw error;
  }
}

module.exports = { postOrder, getOrder, getAllOrders };
