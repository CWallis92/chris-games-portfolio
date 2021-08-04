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

  // Category query
  const uniqueCategories = await db.query(
    `SELECT DISTINCT slug FROM categories`
  );
  const allowedCategories = uniqueCategories.rows.map(
    (category) => category.slug
  );
  const category = query.category ? decodeURIComponent(query.category) : null;
  if (query.category && !allowedCategories.includes(category)) {
    return Promise.reject({ status: 400, msg: "Invalid category query" });
  } else if (allowedCategories.includes(category)) {
    tableQuery += `WHERE reviews.category = $1`;
  }

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

  // Implement sorting and grouping
  tableQuery += `
  GROUP BY reviews.review_id
  ORDER BY reviews.${query.sort_by || "created_at"}
  ${query.order || "DESC"}
  `;

  // Handle escaping in query
  const queryParams = category !== null ? [category] : [];

  const result = await db.query(tableQuery, queryParams);
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "No reviews found",
    });
  }
  return result.rows;
};
