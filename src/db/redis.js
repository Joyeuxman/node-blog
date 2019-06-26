const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');


// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
  console.error(err);
});

// redis 读取值（异步过程）
function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        return reject(err);
      }

      // 处理key值在redis不存在时,取出的val也是null
      if(val === null){
        return resolve(null);
      }

      //尝试将取出的值解析为对象，若不是对象，则为字符串
      try{
        resolve(JSON.parse(val));
      }catch(err1){
        resolve(val);
      }
    });
  });
  return promise;
}

// redis 设置值（同步过程）???
function set(key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  // 存储值成功将之后使用redis.print打印 Reply: OK 表示存储成功 
  redisClient.set(key, val, redis.print);
}

module.exports = {
  get,
  set
};
