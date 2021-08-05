const express = require("express");
const { getUsers, getUserByUsername } = require("../controllers/users");
const { disallowedMethods } = require("../errors");
const usersRouter = express.Router();

usersRouter.route("/").get(getUsers).all(disallowedMethods);

usersRouter.route("/:username").get(getUserByUsername).all(disallowedMethods);

module.exports = usersRouter;
