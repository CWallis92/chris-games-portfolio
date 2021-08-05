const { deleteComment, updateComment } = require("../models/comments");

exports.removeComment = async (req, res, next) => {
  try {
    const comment = await deleteComment(req.params);
    res.status(204).send(comment);
  } catch (err) {
    next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  try {
    const comment = await updateComment(req.params, req.body);
    res.status(202).send({ comment });
  } catch (err) {
    next(err);
  }
};
