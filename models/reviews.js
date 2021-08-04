const db = require("../db/connection");

exports.selectReviewById = async ({ review_id }) => {
  const result = await db.query(
    `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
    FROM reviews 
    LEFT JOIN comments 
    ON comments.review_id = reviews.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
    [review_id]
  );
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Review not found",
    });
  }
  return result.rows[0];
};

exports.updateReviewById = async ({ review_id }, body) => {
  if (!body.hasOwnProperty("inc_votes")) {
    return Promise.reject({
      status: 400,
      msg: "Request only accepts JSON with 'inc_votes' property",
    });
  }
  if (Object.keys(body).length > 1) {
    return Promise.reject({
      status: 422,
      msg: "Unprocessable entity found in request body",
    });
  }
  const result = await db.query(
    `
  UPDATE reviews
  SET 
    votes = votes + $1
  WHERE review_id = $2
  RETURNING *;
  `,
    [body.inc_votes, review_id]
  );
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Review not found",
    });
  }
  return result.rows[0];
};
