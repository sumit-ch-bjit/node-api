const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `${chalk.blue("mongodb connected:")} ${chalk.yellow.bgRed.bold(
        conn.connection.host
      )}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
