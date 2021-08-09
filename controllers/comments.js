const { deleteComment, updateComment } = require("../models/comments");

exports.removeComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await deleteComment(comment_id);
    res.status(204).send(comment);
  } catch (err) {
    next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await updateComment(comment_id, req.body);
    res.status(202).send({ comment });
  } catch (err) {
    next(err);
  }
};
