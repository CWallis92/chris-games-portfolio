exports.formatCategoriesData = (array) => {
  return array.map(({ slug, description }) => [slug, description]);
};

exports.formatUsersData = (array) => {
  return array.map(({ username, name, avatar_url }) => [
    username,
    name,
    avatar_url,
  ]);
};

exports.formatReviewsData = (array) => {
  return array.map(
    ({
      title,
      review_body,
      designer,
      review_img_url,
      votes,
      category,
      owner,
      created_at,
    }) => [
      title,
      review_body,
      designer,
      review_img_url,
      votes,
      category,
      owner,
      created_at,
    ]
  );
};

exports.formatCommentsData = (commentsData, reviewsData) => {
  const reviewsRef = reviewsData.reduce((accumulator, review) => {
    accumulator[review.title] = review.review_id;
    return accumulator;
  }, {});

  return commentsData.map(
    ({ body, belongs_to, created_by, votes, created_at }) => {
      return [created_by, reviewsRef[belongs_to], votes, created_at, body];
    }
  );
};
