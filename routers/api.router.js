const express = require("express");
const { categoriesRouter, reviewsRouter } = require(".");
const apiRouter = express.Router();

apiRouter.route("/").get(() => {
  console.log("Found /api/");
});

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
