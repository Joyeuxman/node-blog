const fs = require('fs');
const path = require('path');

// // callback 方式获取一个文件的内容
// function getFileContent(fileName, callback) {
//   // __dirname 当前文件夹目录路径
//   const fullFileName = path.resolve(__dirname, 'files', fileName);
//   fs.readFile(fullFileName, (err, data) => {
//     if (err) {
//       return console.error(err);
//     }
//     callback(JSON.parse(data.toString()));
//   });
// }

// // 测试
// getFileContent('a.json', contentA => {
//   console.log('contentA===', contentA);
//   getFileContent(contentA.next, contentB => {
//     console.log('contentB===', contentB);
//     getFileContent(contentB.next, contentC => {
//       console.log('contentC===', contentC);
//     });
//   });
// });

// 使用Promise 获取文件内容
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    const fullFileName = path.resolve(__dirname, 'files', fileName);
    fs.readFile(fullFileName, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString()));
    });
  });
  return promise;
}

// 测试 promise
getFileContent('a.json')
  .then(contentA => {
    console.log('contentA===', contentA);
    return getFileContent(contentA.next);
  })
  .then(contentB => {
    console.log('contentB===', contentB);
    return getFileContent(contentB.next);
  })
  .then(contentC => {
    console.log('contentC===', contentC);
  });

  // async await
  // koa2
