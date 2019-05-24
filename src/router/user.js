const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleUserRouter = (req, res) => {
  const { method, path } = req;

  // 登录
  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body;
    const result = login(username, password);
    return result.then(data => {
      if (data.username) {
        // nodejs修改cookie; path = /,表示所有的路由都会生效
        res.setHeader('Set-Cookie',`username=${data.username};path=/`)
        return new SuccessModel();
      } else {
        return new ErrorModel('登录失败');
      }
    });
  }

  // 登录验证的测试
  if (method === 'GET' && req.path === '/api/user/login-test') {
    const { username } = req.cookie;
    if (username) {
      return Promise.resolve(new SuccessModel());
    }
    return Promise.resolve(new ErrorModel('尚未登录'));
  }
};

module.exports = handleUserRouter;
