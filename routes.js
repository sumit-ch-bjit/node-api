const { failure, success } = require("./utils/messages");
const product = require("./model/Product");
const { getQueryParams } = require("./utils/queryParams");

function handleRequests(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  const urlSeachParams = getQueryParams(req);

  req.on("end", async () => {
    if (Object.keys(urlSeachParams).length !== 0 && req.method === "GET") {
      product.getSelectedItems(urlSeachParams, res);
    } else if (req.method === "GET" && req.url === "/get-all-items") {
      product.getAllItems(res);
    } else if (req.method === "POST" && req.url === "/add-product") {
      try {
        const newItem = JSON.parse(body);
        product.addProduct(newItem, res);
      } catch(error) {
        res.writeHead(400, {"Content-Type": "application/json"})
        res.end(failure("invalid json format", error))
      }
      
    } else if (req.method === "GET" && req.url.startsWith("/get-by-id/")) {
      const itemId = req.url.split("/").pop();
      product.getItemById(itemId, res);
    } else if (req.method === "DELETE" && req.url.startsWith("/delete-item/")) {
      const itemId = req.url.split("/").pop();
      product.deleteItemById(itemId, res);
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(failure("no routes matched", { routes: "no matching routes" }));
    }
  });
}

module.exports = { handleRequests };
