const fsPromise = require("fs").promises;
const path = require("path");

class User {
  async findOne({ email }) {
    console.log("hello");
    console.log(email);
    const jsonData = await fsPromise.readFile(
      path.join(__dirname, "..", "data", "data.json")
    );
    const products = JSON.parse(jsonData);
    return products;
  }

  async createUser({ name, email, password }) {}
}

module.exports = new User();
