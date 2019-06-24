const redis = require('redis');

// 创建客户端
const redisClient = redis.createClient(6379,'127.0.0.1');
redisClient.on('error',err=>{
  console.error(err);
})

//测试
redisClient.set('name','zss',redis.print);
redisClient.get('name',(err,val)=>{
  if(err){
    return console.error(err);
  }
  console.log('val===',val);

  // 退出redis
  redisClient.quit();
})