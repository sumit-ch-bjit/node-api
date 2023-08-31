const Order = require("../models/orderModel");
// const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const postOrder = asyncHandler(async (req, res) => {
  try {
    const order = req.body;
    const { user_id, products } = order;

    const total = await calculateTotal(products);

    const createdOrder = await Order.createOrder({
      user_id,
      products,
      total,
      status: "Pending",
    });
    res.status(200).json({ message: "order created", createdOrder });
  } catch (error) {
    throw new Error("internal server error");
  }
});

async function calculateTotal(products) {
  let total = 0;

  for (const product of products) {
    const price = await Order.getPrice(product.product_id);
    total += price * product.quantity;
  }

  return total;
}

module.exports = { postOrder };
