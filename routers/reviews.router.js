const express = require("express");
const { getReviewById, patchReviewById } = require("../controllers/reviews");
const { disallowedMethods } = require("../errors");
const reviewsRouter = express.Router();

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewById)
  .all(disallowedMethods);

module.exports = reviewsRouter;
