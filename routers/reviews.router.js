const express = require("express");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("../controllers/reviews");
const { disallowedMethods } = require("../errors");
const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews).all(disallowedMethods);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewById)
  .all(disallowedMethods);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId)
  .all(disallowedMethods);

module.exports = reviewsRouter;
