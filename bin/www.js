const http = require('http');

const PORT = 9003;
const serverHandle = require('../app');

const server = http.createServer(serverHandle);
server.listen(PORT, () => {
  console.log('node-blog is running on ' + PORT + '...');
});
