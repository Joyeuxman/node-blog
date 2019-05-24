const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleBlogRouter = (req, res) => {
  const { method, path } = req;
  const { id } = req.query;

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const author = req.query.author || '';
    const keyword = req.query.keyword || '';

    // const data = getList(author, keyword);
    // return new SuccessModel(data);

    const result = getList(author, keyword);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
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
    // const data = newBlog(req.body);
    // return new SuccessModel(data);

    req.body.author = 'ligh'; // 假数据，待开发登录时再改成真实数据
    const result = newBlog(req.body);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 更新一篇博客
  if (method === 'POST' && path === '/api/blog/update') {
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
    const author = 'ligh'; // 假数据，待开发登录时再改成真实数据
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
