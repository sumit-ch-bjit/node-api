const express = require("express");
const items = require("./routes/itemRoutes");
const users = require("./routes/userRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const dotenv = require("dotenv");
const chalk = require("chalk");
dotenv.config();
// const colors = require("colors");

const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/items", items);
app.use("/api/users", users);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${chalk.blue.bgRed.bold(port)}...`);
});
