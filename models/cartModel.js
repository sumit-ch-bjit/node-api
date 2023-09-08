const mongoose = require("mongoose");

// const cartItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product", // Reference to the Product model
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1, // Minimum quantity should be 1
//   },
// });

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Minimum quantity should be 1
        },
      },
    ], // Array of cart items, each with a product and quantity
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
