const express = require("express");
const { categoriesRouter } = require("./index.router");
const apiRouter = express.Router();

apiRouter.route("/").get(() => {
  console.log("Found /api/");
});

apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
