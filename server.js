const http = require('http');
const { handleRequests } = require('./routes');


const port = 3000;

const server = http.createServer(handleRequests);


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
