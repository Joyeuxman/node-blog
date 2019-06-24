// 获取 cookie 的过期时间(设置cookie的过期时间为一天之后)
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  // console.log('d.toGMTString===', d.toGMTString());
  return d.toGMTString();
};

module.exports = {
  getCookieExpires
}
