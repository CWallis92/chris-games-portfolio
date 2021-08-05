const db = require("../db/connection");

exports.selectUsers = async () => {
  const result = await db.query("SELECT username FROM users;");
  return result.rows;
};

exports.selectUserByUsername = async (params) => {
  const result = await db.query(`SELECT * FROM users WHERE username = $1`, [
    params.username,
  ]);
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "User not found",
    });
  }
  return result.rows[0];
};
