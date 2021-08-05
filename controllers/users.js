const { selectUsers } = require("../models/users");

exports.getUsers = async (req, res) => {
  const users = await selectUsers();
  res.status(200).send({ users });
};
