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
  return commentsData.map(
    ({ body, belongs_to, created_by, votes, created_at }) => {
      const { review_id } = reviewsData.find(
        (review) => review.title === belongs_to
      );
      return [created_by, review_id, votes, created_at, body];
    }
  );
};
