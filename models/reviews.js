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
  console.log(result);
  if (result.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Review not found",
    });
  }
  return result.rows[0];
};

/*
const insertRestaurant = (restaurant) => {
  const allowedKeys = ['restaurant_name', 'area_id', 'cuisine', 'website'];
  for (let key in restaurant) {
      //this our custom Handling
    if (!allowedKeys.includes(key)) {
      return Promise.reject({
        status: 400,
        msg: 'Bad Request'
      });
    }
  }
  // if bellow query errors , we will b taken to handle error psql
  return db
    .query(
      'INSERT INTO restaurants (restaurant_name, area_id, cuisine, website) VALUES ($1, $2, $3, $4) RETURNING *;',
      [
        `${restaurant.restaurant_name}`,
        `${restaurant.area_id}`,
        `${restaurant.cuisine}`,
        `${restaurant.website}`
      ]
    )
    .then((results) => {
      return results.rows[0];
    });
};

*/
