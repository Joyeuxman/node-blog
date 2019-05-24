const { exec } = require('../db/mysql');

const login = (username, password) => {
  const sql = `
  select username,realname from users
  where username='${username}' and password='${password}'
  `;
  return exec(sql).then(rows=>{
    console.log('登录的用户===',rows[0]);
    return rows[0] || {};
  })
};

module.exports = {
  login
};
