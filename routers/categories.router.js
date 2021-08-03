const express = require("express");
const { getCategories } = require("../controllers/categories");
const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
