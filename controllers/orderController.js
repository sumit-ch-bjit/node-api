const Order = require("../models/orderModel");
const Product = require("../models/productModel");
// const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const postOrder = asyncHandler(async (req, res) => {
  try {
    const order = req.body;
    const { user, products } = order;

    // console.log(products);

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
      .populate("user", "-password")
      .populate("products", "-imageUrl -products")
      .then((order) => {
        return res.status(200).json({ message: "order found", order });
      })
      .catch((error) => {
        return res.status(404).json({ message: "order not found", error });
      });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
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

module.exports = { postOrder, getOrder };
