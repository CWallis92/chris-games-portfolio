const db = require("../db/connection");

exports.deleteComment = async (comment_id) => {
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

exports.updateComment = async (comment_id, body) => {
  if (!body.hasOwnProperty("inc_votes")) {
    return Promise.reject({
      status: 400,
      msg: "Request only accepts JSON with 'inc_votes' property",
    });
  }
  const result = await db.query(
    `
  UPDATE comments
  SET
    votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  ;`,
    [body.inc_votes, comment_id]
  );
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Comment not found",
    });
  }
  return result.rows[0];
};
