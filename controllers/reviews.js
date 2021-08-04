const { selectReviewById, updateReviewById } = require("../models/reviews");

exports.getReviewById = async (req, res, next) => {
  try {
    const review = await selectReviewById(req.params);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewById = async (req, res, next) => {
  try {
    const review = await updateReviewById(req.params, req.body);
    res.status(202).send({ review });
  } catch (err) {
    next(err);
  }
};
