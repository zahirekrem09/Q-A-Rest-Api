const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  //   console.log(user);
  if (user.role !== "admin") {
    return next(new CustomError("Only admin can access this route", 403));
  }
  next();
});

module.exports = getAdminAccess;
