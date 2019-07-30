const querystring = require('querystring');
const { get, set } = require('./src/db/redis');
const {access} = require('./src/utils/log');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { getCookieExpires } = require('./src/utils/index');

// // 存储 session（通过js变量）
// const SESSION_DATA = {};

// 处理 post data
const getPostData = req => {
  const promise = new Promise(resolve => {
    if (req.method !== 'POST') {
      return resolve({});
    }
    if (req.headers['content-type'] !== 'application/json') {
      return resolve({});
    }

    let postData = '';
    req.on('data', chunk => {
      postData += chunk;
    });
    req.on('end', () => {
      if (!postData) {
        return resolve({});
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  // 写入日志
  access(`${req.method}  --  ${req.url}  --  ${req.headers['user-agent']}  --  ${Date.now()}`)

  // 设置返回数据格式为json格式
  res.setHeader('content-type', 'application/json');

  const url = req.url;
  req.path = url.split('?')[0];

  // 解析query
  req.query = querystring.parse(url.split('?')[1]);

  // 解析cookie  中文乱码???
  req.cookie = {};
  const cookieStr = req.headers.cookie || '';
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    // js添加cookie时，会自动添加一个空格,所以将空格去掉
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });
  console.log('req.cookie===', req.cookie);

  // // 解析session（使用本地JS变量）
  // let needSetCookie = false;
  // let userId = req.cookie.userId;
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   }
  // } else {
  //   needSetCookie = true;
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  // }
  // req.session = SESSION_DATA[userId];
  // console.log('req.session===', req.session);

  // 解析session（使用redis）
  let needSetCookie = false;
  let userId = req.cookie.userId;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化 redis 中的session值
    set(userId, {});
  }
  // 获取session
  req.sessionId = userId;
  get(req.sessionId)
    .then(sessionData => {
      if (sessionData === null) {
        // 初始化 redis 中的session值
        set(userId, {});
        // 初始化 session
        req.session = {};
      } else {
        // 设置 session
        req.session = sessionData;
      }
      console.log('req.session===', req.session);

      // 处理 post data
      return getPostData(req);
    })
    .then(postData => {
      req.body = postData;

      // 处理blog路由
      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            // nodejs修改cookie;
            // path = /,表示所有的路由都会生效
            // httpOnly 表示cookie只允许后端修改,不能通过前端JS修改
            // expires  表示cookie的过期时间
            res.setHeader(
              'Set-Cookie',
              `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      // 处理user路由
      const userResult = handleUserRouter(req, res);
      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            res.setHeader(
              'Set-Cookie',
              `userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(userData));
        });
        return;
      }

      // 未命中路由，返回404
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.write('404 Not Found \n');
      res.end();
    });
};

module.exports = serverHandle;
