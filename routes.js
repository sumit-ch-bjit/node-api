const url = require('url');
const querystring = require('querystring');
const { readFile, writeFile } = require('./utils');

function handleRequests(req, res) {
    if (req.method === 'GET' && req.url === '/') {

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Hello World</h1>');

    } else if (req.method === 'POST' && req.url === '/add-item') {

        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const newItem = JSON.parse(body);
                // Validate newItem to ensure mandatory fields are present
                if (!newItem.name || !newItem.description || !newItem.price) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing mandatory fields' }));
                    return;
                }

                readFile('data.json')
                    .then(jsonData => {
                        const itemsArray = JSON.parse(jsonData).items;
                        itemsArray.push(newItem); // Add the new item to the array
                        return writeFile('data.json', JSON.stringify({ items: itemsArray }));
                    })
                    .then(() => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Item added successfully' }));
                    })
                    .catch(error => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error writing to data.json' }));
                    });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });

    } else if (req.method === 'GET') {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        // Check if the request is for all items or selected items
        if (parsedUrl.pathname === '/get-item') {
            if (Object.keys(queryParams).length === 0) {
                getAllItems(res);
            } else {
                getSelectedItems(queryParams, res);
            }
        }
    } else if (req.method === 'PUT' && req.url === '/update-item') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const updatedItem = JSON.parse(body);
                // Validate updatedItem to ensure mandatory fields are present
                if (!updatedItem.name || !updatedItem.description || !updatedItem.price) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing mandatory fields' }));
                    return;
                }

                readFile('data.json')
                    .then(jsonData => {
                        const itemsArray = JSON.parse(jsonData).items;
                        // Find the index of the item to be updated
                        const itemIndex = itemsArray.findIndex(item => item.name === updatedItem.name);
                        // Update the item in the array
                        itemsArray[itemIndex] = updatedItem;
                        return writeFile('data.json', JSON.stringify({ items: itemsArray }));
                    })
                    .then(() => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Item updated successfully' }));
                    })
                    .catch(error => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error writing to data.json' }));
                    });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
    } else if(req.method === 'DELETE' && req.url === '/delete-item') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const deletedItem = JSON.parse(body);
                // Validate deletedItem to ensure mandatory fields are present
                if (!deletedItem.name) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing mandatory fields' }));
                    return;
                }

                readFile('data.json')
                    .then(jsonData => {
                        const itemsArray = JSON.parse(jsonData).items;
                        // Find the index of the item to be deleted
                        const itemIndex = itemsArray.findIndex(item => item.name === deletedItem.name);
                        // Delete the item from the array using filter
                        const filteredItems = itemsArray.filter(item => item.name !== deletedItem.name);
                        return writeFile('data.json', JSON.stringify({ items: filteredItems }));
                    })
                    .then(() => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Item deleted successfully' }));
                    })
                    .catch(error => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error writing to data.json' }));
                    });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
}

function getAllItems(res) {
    readFile('data.json')
        .then(jsonData => {
            const itemsArray = JSON.parse(jsonData).items;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(itemsArray));
        })
        .catch(error => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error reading data.json' }));
        });
}

function getSelectedItems(queryParams, res) {
    console.log(queryParams.name)
    readFile('data.json')
        .then(jsonData => {
            const itemsArray = JSON.parse(jsonData).items;

            // Filter items based on query parameters
            const selectedItems = itemsArray.filter(item => {
                if (queryParams.name && item.name !== queryParams.name) {
                    return false;
                }
                return true;
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(selectedItems));
        })
        .catch(error => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error reading data.json' }));
        });
}

module.exports = { handleRequests };