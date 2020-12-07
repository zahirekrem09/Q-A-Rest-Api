const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/auth/JwtTokenHelpers");
const validateUserInput = require("../helpers/auth/inputHelpers");
const comparePassword = require("../helpers/auth/comparePassword");
const CustomError = require("../helpers/error/CustomError");

const register = asyncErrorWrapper(async (req, res, next) => {
  //post Data (req.body)
  // const name = "Ekrem";
  // const email = "ekrem@gmail.com";
  // const password = "123456";

  const { name, email, password, role } = req.body;

  // async await;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // const token = user.generateJwtFromUser();
  // console.log(token);

  // res.status(200).json({
  //   success: true,
  //   data: user,
  // });
  sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs!", 400));
  }
  // async await;
  const user = await User.findOne({ email }).select("+password");
  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check  your credentials!", 400));
  }
  // console.log(user);
  // res.status(200).json({
  //   success: true,
  //   data: user,
  // });
  sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

// const tokenTest = (req, res, next) => {
//   res.json({
//     success: true,
//     message: "Welcome Api",
//   });
// };
const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
};

module.exports = {
  register,
  login,
  logout,
  // tokenTest,
  getUser,
};
