const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = req => {
  const { username } = req.session;
  if (!username) {
    return Promise.resolve(new ErrorModel('尚未登录'));
  }
};

const handleBlogRouter = (req, res) => {
  const { method, path } = req;
  const { id } = req.query;

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const author = req.query.author || '';
    const keyword = req.query.keyword || '';

    // const data = getList(author, keyword);
    // return new SuccessModel(data);

    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheck;
    }

    const result = getList(author, keyword);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheck;
    }

    const { id = '' } = req.query;

    // const data = getDetail(id);
    // return new SuccessModel(data);

    const result = getDetail(id);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 新建一篇博客
  if (method === 'POST' && path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheck;
    }
    
    // const data = newBlog(req.body);
    // return new SuccessModel(data);

    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 更新一篇博客
  if (method === 'POST' && path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheck;
    }

    const result = updateBlog(id, req.body);
    return result.then(data => {
      if (data) {
        return new SuccessModel();
      } else {
        return new ErrorModel('更新博客失败');
      }
    });
  }

  // 删除一篇博客
  if (method === 'POST' && path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheck;
    }

    const author = req.session.username;
    // 只有作者自己才能删除自己的博客
    const result = delBlog(id, author);
    return result.then(data => {
      if (data) {
        return new SuccessModel();
      } else {
        return new ErrorModel('删除博客失败');
      }
    });
  }
};

module.exports = handleBlogRouter;
