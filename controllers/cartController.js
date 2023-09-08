const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel"); // Replace with the actual Cart model import
const Product = require("../models/productModel"); // Replace with the actual Product model import
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");

const calculateAndUpdateTotal = async (cart) => {
  let total = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  // Update the cart's total field
  cart.total = total;

  // Save the updated cart
  await cart.save();
};

const addToCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errors);
    } else {
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if the user already has a cart; create one if not
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = new Cart({ user: userId, items: [], total: 0 });
      }

      // Check if the product is already in the cart; update quantity if so, add if not
      const existingCartItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingCartItem) {
        // Check if adding the quantity would exceed the product's stock
        if (existingCartItem.quantity + quantity > product.stock) {
          return res
            .status(400)
            .json({ message: "Quantity exceeds product stock" });
        }

        existingCartItem.quantity += quantity;
      } else {
        // Check if adding the quantity would exceed the product's stock
        if (quantity > product.stock) {
          return res
            .status(400)
            .json({ message: "Quantity exceeds product stock" });
        }

        cart.items.push({ product: productId, quantity });
      }

      // Save the updated cart
      await cart.save();

      // Calculate and update the cart's total
      await calculateAndUpdateTotal(cart);

      res
        .status(200)
        .json({ message: "Item added to cart successfully", cart });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ errors });
    } else {
      const userExists = await User.exists({ _id: userId });

      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      cart.items.splice(itemIndex, 1);

      if (cart.items.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return res
          .status(200)
          .json({ message: "Cart deleted because it is empty" });
      }

      const remainingProducts = cart.items.filter(
        (product) => product.toString() !== productId
      );
      cart.products = remainingProducts;

      await cart.save();

      await calculateAndUpdateTotal(cart);

      res
        .status(200)
        .json({ message: "Item removed from cart successfully", cart });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addToCart, removeFromCart };
