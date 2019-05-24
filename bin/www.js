const http = require('http');

const PORT = 3008;
const serverHandle = require('../app');

const server = http.createServer(serverHandle);
server.listen(PORT, () => {
  console.log('node-blog is running on ' + PORT + '...');
});
