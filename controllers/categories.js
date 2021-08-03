const { selectCategories } = require("../models/categories");

exports.getCategories = async (req, res) => {
  const categories = await selectCategories();
  res.status(200).send({ categories });
};
