const express = require("express");
const { categoriesRouter, reviewsRouter } = require(".");
const { disallowedMethods } = require("../errors");
const apiRouter = express.Router();

apiRouter
  .route("/")
  .get((req, res) => {
    res.status(200).send({
      endpoints: {
        "/api/categories": {
          GET: "Returns a list of all categories available, as well as their descriptions",
        },
        "/api/reviews": {
          GET: "Returns a list of reviews for board games. The endpoint accepts the following queries: 1) sort_by: specify the column name to sort the reviews (defaults to 'created_at'), 2) order: specify if the sort should be ascending (asc) or descending (desc) (defaults to desc), 3) category: filter the reviews by their category",
        },
        "/api/reviews/:review_id": {
          GET: "Returns a single review, as specified by the review ID. Replace ':review_id' with a positive integer",
          PATCH:
            "Updates the specified review, incrementing the vote count by the number given. Request body must be a JSON object with a single key 'inc_votes', whose value is an integer",
        },
        "/api/reviews/:review_id/comments": {
          GET: "Returns a list of comments for the given review. Replace ':review_id' with a positive integer",
          POST: "Adds a comment to the given review. Request body must be a JSON object with keys 'username' and 'body'. 'username' must be an existing user from the database. You can view users at the '/api/users endpoint",
        },
      },
    });
  })
  .all(disallowedMethods);

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
