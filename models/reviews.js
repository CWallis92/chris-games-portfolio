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
