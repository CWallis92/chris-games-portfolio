const express = require("express");
const { getCategories } = require("../controllers/categories");
const { disallowedMethods } = require("../errors");
const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getCategories).all(disallowedMethods);

module.exports = categoriesRouter;
