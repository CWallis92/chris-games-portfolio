const { restart } = require("nodemon");
const { selectUsers, selectUserByUsername } = require("../models/users");

exports.getUsers = async (req, res) => {
  const users = await selectUsers();
  res.status(200).send({ users });
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const user = await selectUserByUsername(req.params);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
