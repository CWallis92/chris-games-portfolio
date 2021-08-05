const express = require("express");
const { getUsers } = require("../controllers/users");
const { disallowedMethods } = require("../errors");
const usersRouter = express.Router();

usersRouter.route("/").get(getUsers).all(disallowedMethods);

module.exports = usersRouter;
