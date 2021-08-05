const express = require("express");
const { removeComment } = require("../controllers/comments");
const { disallowedMethods } = require("../errors");
const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .delete(removeComment)
  .all(disallowedMethods);

module.exports = commentsRouter;
