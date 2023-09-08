const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
const HTTP_STATUS = require("../constants/statusCodes");

const checkout = asyncHandler(async (req, res) => {
  const { cartId } = req.body;
  console.log(cartId);

  try {
    const cart = await Cart.findById(cartId)
      .populate("user", "-createdAt -updatedAt")
      .populate("items.product");

    console.log(cart);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      console.log("no items in the products");
    }

    const order = new Order({
      user: cart.user,
      products: cart.items,
      total: cart.total,
    });

    // console.log(order);

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        // Ensure the product has enough stock
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          return res.status(400).json({
            message: "Insufficient stock for some products in the order",
          });
        }
      }
    }

    await order.save();

    cart.items = [];
    cart.total = 0;

    await cart.save();

    await Cart.findByIdAndDelete(cartId);

    res
      .status(200)
      .json({ message: "Order created and cart cleared successfully", order });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
          .status(HTTP_STATUS.OK)
          .json({ message: "order created successfully", order });
      })
      .catch((error) => {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
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
      .populate("products.product", "-imageUrl")
      .then((order) => {
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "order found", order });
      })
      .catch((error) => {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "order not found", error });
      });
  } catch (error) {
    throw new Error("internal server error");
  }
});

// const getAllOrders = asyncHandler(async (req, res) => {
//   try {
//     await Order.find()
//       .populate("user", "-password")
//       .populate("products.product")
//       .then((order) => {
//         return res.status(200).json({ message: "all orders", order });
//       })
//       .catch((error) => {
//         return res.status(400).json({ message: "no orders found", error });
//       });
//   } catch (error) {
//     throw new Error("internal server error");
//   }
// });

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

module.exports = { postOrder, getOrder, checkout };
