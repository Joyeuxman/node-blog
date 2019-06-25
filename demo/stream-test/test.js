// 标准输入输出 linux
// process.stdin.pipe(process.stdout);

// post请求
// const http = require('http');
// const server = http.createServer((req,res)=>{
//   console.log('123')
//   if(req.method === 'POST'){
//     req.pipe(res);
//   }
// })
// server.listen(6009,()=>{
//   console.log('server is running on 6009');
// });

// 复制文件
// const path = require('path');
// const fs = require('fs');

// const fileName1 = path.resolve(__dirname,'data.txt');
// const fileName2 = path.resolve(__dirname,'data-bak.txt');

// const readStream = fs.createReadStream(fileName1);
// const writeStream = fs.createWriteStream(fileName2);

// readStream.pipe(writeStream);

// readStream.on('data',chunk=>{
//   console.log('chunk',chunk.toString());
// })

// readStream.on('end',()=>{
//   console.log('copy done');
// })

// 请求文件
const http = require('http');
const path = require('path');
const fs = require('fs');

const fileName1 = path.resolve(__dirname, 'data.txt');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const readStream = fs.createReadStream(fileName1);
    readStream.pipe(res);
  }
});
server.listen(6008, () => {
  console.log('server is running on 6008');
});
