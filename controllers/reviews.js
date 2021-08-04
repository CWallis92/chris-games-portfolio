const { selectReviewById } = require("../models/reviews");

exports.getReviewById = async (req, res, next) => {
  try {
    const review = await selectReviewById(req.params);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};
