const express = require("express");
const items = require("./routes/itemRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
// const colors = require("colors");

const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/items", items);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
