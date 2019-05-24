const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

// 用于处理 post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
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
  const url = req.url;
  req.path = url.split('?')[0];

  // 设置返回数据格式为json格式
  res.setHeader('content-type', 'application/json');

  // 解析query
  req.query = querystring.parse(url.split('?')[1]);

  // 解析 cookie  中文乱码???
  req.cookie = {};
  const cookieStr = req.headers.cookie || '';
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    const key = arr[0];
    const val = arr[1];
    req.cookie[key] = val;
  });
  console.log('req.cookie===', req.cookie);

  // 处理 post data
  getPostData(req).then(postData => {
    req.body = postData;

    // 处理blog路由
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
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
