const fs = require('fs');
const path = require('path');

const fileName = path.resolve(__dirname, 'data.txt');

// //读取文件内容
// fs.readFile(fileName, (err, data) => {
//   if (err) {
//     return console.error(err);
//   }
//   // data为二进制类型数据，需要转化为string
//   console.log(data.toString());
// });

// 写入文件
const content = '这是新增加的内容\n';
const opt = {
  flag: 'a' // 写入文件的方式：'a'--> 增加内容 'w'-->覆盖之前的内容
};
fs.writeFile(fileName, content, opt, err => {
  if (err) {
    return console.error(err);
  }
});

// 判断文件是否存在
fs.exists(fileName,(exist)=>{
  console.log('exist',exist);
})

