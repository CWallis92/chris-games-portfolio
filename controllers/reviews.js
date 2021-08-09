const {
  selectReviewById,
  updateReviewById,
  selectReviews,
  selectCommentsByReviewId,
  insertCommentByReviewId,
} = require("../models/reviews");

exports.getReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await selectReviewById(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await updateReviewById(review_id, req.body);
    res.status(202).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await selectReviews(req.query);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comments = await selectCommentsByReviewId(review_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comment = await insertCommentByReviewId(review_id, req.body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
