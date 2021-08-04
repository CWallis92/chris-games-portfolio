const express = require("express");
const {
  getReviewById,
  patchReviewById,
  getReviews,
} = require("../controllers/reviews");
const { disallowedMethods } = require("../errors");
const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews).all(disallowedMethods);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewById)
  .all(disallowedMethods);

module.exports = reviewsRouter;
