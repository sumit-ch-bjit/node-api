const express = require("express");
const cors = require("cors");
const items = require("./routes/productRoutes");
const users = require("./routes/userRoutes");
const orders = require("./routes/orderRoutes");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const errorLogger = require("./middleware/errorLogger");
const dotenv = require("dotenv");
const chalk = require("chalk");
dotenv.config();
// const colors = require("colors");
const port = 3000;
connectDB();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

errorLogger.setupUnhandledExceptionLogging();

app.use("/api/items", items);
app.use("/api/users", users);
app.use("/api/orders", orders);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${chalk.yellow.bgRed.bold(port)}...`);
});
