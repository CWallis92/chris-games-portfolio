const express = require("express");
const { removeComment, patchComment } = require("../controllers/comments");
const { disallowedMethods } = require("../errors");
const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .delete(removeComment)
  .patch(patchComment)
  .all(disallowedMethods);

module.exports = commentsRouter;
