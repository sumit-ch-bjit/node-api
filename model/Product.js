const { readFile, writeFile } = require("../utils/fileOperation");
const { success, failure } = require("../utils/messages");

class Product {

  async getAllItems(res) {
    readFile("data.json")
      .then((jsonData) => {
        const itemsArray = JSON.parse(jsonData).items;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(itemsArray));
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(failure("error reading data.json", error));
      });
  }

  async getSelectedItems(queryObj, res) {
    readFile("data.json")
      .then((jsonData) => {
        const itemsArray = JSON.parse(jsonData).items;
        return itemsArray;
      })
      .then((itemsArray) => {
        return itemsArray.filter((item) => {
          for (const key in queryObj) {
            if (queryObj.hasOwnProperty(key)) {
              if (item[key] !== queryObj[key]) {
                return false;
              }
            }
          }
          return true;
        });
      })
      .then((selectedItems) => {
        if (selectedItems.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(selectedItems));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(failure("no item found"));
        }
      })
      .catch((error) => {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(failure(error));
      });
  }

  async addProduct(newItem, res) {
    const error = {};
    const { name, description, price } = newItem;
    if (!name || name === "") {
      error.name = "name property missing";
    }
    if (!description || description === "") {
      error.description = "description property missing";
    }
    if (!price || price < 50) {
      error.price = "price is not correct";
    }
    if (Object.keys(error).length > 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify(error));
      return;
    }
    readFile("data.json")
      .then((jsonData) => {
        const itemsArray = JSON.parse(jsonData).items;
        // console.log(itemsArray)
        const newItemWithID = {
          ...newItem,
          id: itemsArray[itemsArray.length - 1].id + 1,
        };
        itemsArray.push(newItemWithID); // Add the new item to the array
        return writeFile("data.json", JSON.stringify({ items: itemsArray }));
      })
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(success("item added succefully", newItem));
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(failure("error writing to data.json", error));
      });
  }
  
  async getItemById(itemId, res) {
    readFile("data.json")
      .then((jsonData) => {
        itemId = parseInt(itemId);
        const itemsArray = JSON.parse(jsonData).items;
        const selectedItem = itemsArray.find((item) => {
          // console.log(item.id)
          return item.id === itemId;
        });
        // const selectItem = itemsArray.filter(item => item.id === itemId)
        // console.log(selectItem)
        if (selectedItem) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(selectedItem));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Item not found" }));
        }
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error reading data.json" }));
      });
  }
  async deleteItemById(itemId, res) {
    readFile("data.json")
      .then((jsonData) => {
        itemId = parseInt(itemId);
        const parsedData = JSON.parse(jsonData);
        const itemsArray = parsedData.items;
        const index = itemsArray.findIndex((item) => item.id === itemId);

        if (index !== -1) {
          itemsArray.splice(index, 1);
          writeFile("data.json", JSON.stringify(parsedData))
            .then(() => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Item deleted successfully" }));
            })
            .catch((error) => {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Error writing data.json" }));
            });
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Item not found" }));
        }
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error reading data.json" }));
      });
  }
}

module.exports = new Product();
