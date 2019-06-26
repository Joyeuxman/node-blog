const path = require('path');
const fs = require('fs');

// 创建写入流
function createWriteStream(filename) {
  const fullFilename = path.join(__dirname, '../', '../', 'logs',filename);
  const writeStream = fs.createWriteStream(fullFilename, {
    flags: 'a'
  });
  return writeStream;
}

// 写入日志
function writeLog(writeStream, log) {
  writeStream.write(log + '\n');
}

// access log
const accessWriteStream = createWriteStream('access.log');
function access(log) {
  writeLog(accessWriteStream, log);
}

module.exports = {
  access
};
