const fsPromise = require("fs").promises;

class Product {
  async getAllItems() {
    try {
      const jsonData = await fsPromise.readFile("data.json");

      // console.log(jsonData);

      const itemsArray = JSON.parse(jsonData);

      // console.log(itemsArray);

      return itemsArray;
    } catch (error) {
      throw new Error("could not read from file");
    }
  }

  async addProduct(newItem) {
    // console.log("added new product");
    try {
      const jsonData = await fsPromise.readFile("data.json");

      const items = JSON.parse(jsonData);

      items.push(newItem);

      await fsPromise.writeFile("data.json", JSON.stringify(items));
      // return newItemObj;
    } catch (error) {
      throw new Error({ error: error });
    }
  }

  async findItem(id) {
    try {
      const jsonData = await fsPromise.readFile("data.json");
      const itemsArray = JSON.parse(jsonData);

      const foundItem = itemsArray.filter((item) => item.id === id);

      return foundItem;
    } catch (error) {
      throw new Error("item not found");
    }
  }
  async findByIdAndUpdate(id, product) {
    try {
      const jsonData = await fsPromise.readFile("data.json");
      const itemsArray = JSON.parse(jsonData);
      // console.log(itemsArray);
      const index = itemsArray.findIndex((item) => {
        // console.log(item.id);
        return item.id === id;
      });

      if (index !== -1) {
        itemsArray[index] = { ...itemsArray[index], ...product };
        console.log(itemsArray);
      }

      await fsPromise.writeFile("data.json", JSON.stringify(itemsArray));
    } catch (error) {
      throw new Error("error adding new product");
    }
  }

  async findByIdAndDelete(id) {
    try {
      const jsonData = await fsPromise.readFile("data.json");
      const itemsArray = JSON.parse(jsonData);
      console.log(itemsArray);
      const index = itemsArray.findIndex((item) => {
        return item.id === id;
      });

      if (index !== -1) {
        itemsArray.splice(index, 1);
      }

      await fsPromise.writeFile("data.json", JSON.stringify(itemsArray));
    } catch (error) {
      throw new Error("error adding new product");
    }
  }
}

module.exports = new Product();
