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

exports.selectReviews = async (query) => {
  let tableQuery = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  `;

  const queryParams = [];

  // Sorting query
  const allowedSorts = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "reviews.votes",
  ];
  if (query.sort_by && !allowedSorts.includes(query.sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  // Order query
  if (query.order && !["asc", "desc"].includes(query.order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  // Category query
  if (query.category) {
    const uniqueCategories = await db.query(
      `SELECT DISTINCT slug FROM categories`
    );
    const allowedCategories = uniqueCategories.rows.map(
      (category) => category.slug
    );
    const category = decodeURIComponent(query.category);
    queryParams.push(category);
    if (!allowedCategories.includes(category)) {
      return Promise.reject({ status: 400, msg: "Invalid category query" });
    } else tableQuery += `WHERE reviews.category = $1`;
  }

  // Implement sorting and grouping
  tableQuery += `
  GROUP BY reviews.review_id
  ORDER BY reviews.${query.sort_by || "created_at"}
  ${query.order || "DESC"}
  `;

  const result = await db.query(tableQuery, queryParams);
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "No reviews found",
    });
  }
  return result.rows;
};

exports.selectCommentsByReviewId = async ({ review_id }) => {
  const review = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [
    review_id,
  ]);
  if (review.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Review not found",
    });
  }
  const result = await db.query(
    `
  SELECT * FROM comments WHERE review_id = $1
  `,
    [review_id]
  );
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "No comments available",
    });
  }
  return result.rows;
};

exports.insertCommentByReviewId = async ({ review_id }, req) => {
  if (!req.hasOwnProperty("username") || !req.hasOwnProperty("body")) {
    return Promise.reject({
      status: 400,
      msg: "Request only accepts JSON with 'username' and 'body' properties",
    });
  }

  if (Object.keys(req).length > 2) {
    return Promise.reject({
      status: 422,
      msg: "Unprocessable entity found in request body",
    });
  }

  const user = await db.query(`SELECT * FROM users WHERE username = $1`, [
    req.username,
  ]);
  if (user.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "User not found. Please add the user before commenting",
    });
  }

  const review = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [
    review_id,
  ]);
  if (review.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Review not found",
    });
  }

  const { username, body } = req;
  const result = await db.query(
    `
  INSERT INTO comments 
    (review_id, author, body)
  VALUES
    ($1, $2, $3)
  RETURNING *
  ;`,
    [review_id, username, body]
  );
  return result.rows[0];
};
