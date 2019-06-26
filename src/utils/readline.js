const path = require('path');
const fs = require('fs');
const readline = require('readline');

// 文件名称
const filename = path.join(__dirname, '../', '../', 'logs', 'access.log');

// 创建 read stream
const readStream = fs.createReadStream(filename);

// 创建readline对象
const rl = readline.createInterface({
  input: readStream
});

let chromeNum = 0; //谷歌数量
let sum = 0; //总数

// 逐行读取
rl.on('line', lineData => {
  if (!lineData) {
    return;
  }

  // 记录总数
  sum++;

  //记录谷歌浏览器的数量
  const arr = lineData.split('  --  ');
  console.log('arr[2]===',arr);
  if (arr[2] && arr[2].indexOf('Chrome') > 0) {
    chromeNum++;
  }
});

// 监听读取完成
rl.on('close', () => {
  console.log('chromeNum===', chromeNum);
  console.log('sum===', sum);
  console.log('谷歌浏览器占比===', chromeNum / sum);
});
