const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const blockUser = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  user.blocked = !user.blocked;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Block-Unblock Successfull",
  });
});

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  user.blocked = !user.blocked;

  await user.remove();

  return res.status(200).json({
    success: true,
    message: "User Delete  Successfull",
  });
});

module.exports = {
  blockUser,
  deleteUser,
};
