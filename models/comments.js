const db = require("../db/connection");

exports.deleteComment = async ({ comment_id }) => {
  const result = await db.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;`,
    [comment_id]
  );
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Comment not found",
    });
  }
  return;
};
