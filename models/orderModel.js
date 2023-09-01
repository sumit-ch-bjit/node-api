const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  products: [
    {
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Number,
  },
  // Other order-related fields
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// const fsPromise = require("fs").promises;
// const path = require("path");

// class Order {
//   async getPrice(id) {
//     try {
//       const jsonData = await fsPromise.readFile(
//         path.join(__dirname, "..", "data", "products.json")
//       );
//       const productsArray = JSON.parse(jsonData);

//       //   console.log(productsArray);

//       const product = productsArray.find((product) => {
//         return id === product.id;
//       });
//       return product.price;
//     } catch (error) {
//       throw new Error("could not find product");
//     }
//   }
//   async createOrder(order) {
//     try {
//       const jsonData = await fsPromise.readFile(
//         path.join(__dirname, "..", "data", "orders.json")
//       );

//       const ordersArray = JSON.parse(jsonData);

//       const nextOrderId = ordersArray[ordersArray.length - 1].order_id + 1;

//       const orderToAdd = { ...order, order_id: nextOrderId };

//       ordersArray.push(orderToAdd);

//       await fsPromise.writeFile(
//         path.join(__dirname, "..", "data", "orders.json"),
//         JSON.stringify(ordersArray)
//       );

//       return orderToAdd;
//     } catch (error) {
//       throw new Error("failed to read or write to file");
//     }
//   }

//   async getUserOrders(id) {
//     // console.log(typeof id);
//     // console.log(+id);
//     try {
//       const jsonData = await fsPromise.readFile(
//         path.join(__dirname, "..", "data", "orders.json")
//       );

//       const ordersArray = JSON.parse(jsonData);

//       const ordersByUser = ordersArray.filter((order) => {
//         return order.user_id === +id;
//       });

//       //   console.log(ordersByUser);
//       return ordersByUser;
//     } catch (error) {
//       throw new Error("could not read from file");
//     }
//   }
// }

// module.exports = new Order();
