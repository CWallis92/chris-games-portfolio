const { deleteComment } = require("../models/comments");

exports.removeComment = async (req, res, next) => {
  try {
    const comment = await deleteComment(req.params);
    res.status(204).send(comment);
  } catch (err) {
    next(err);
  }
};
