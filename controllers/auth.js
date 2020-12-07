const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/auth/JwtTokenHelpers");
const validateUserInput = require("../helpers/auth/inputHelpers");
const sendEmail = require("../helpers/auth/sendEmail");
const comparePassword = require("../helpers/auth/comparePassword");
const CustomError = require("../helpers/error/CustomError");
const { findByIdAndUpdate } = require("../models/User");

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
//TODO: TypeError: Cannot read property 'id' of undefined
const imageUpload = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_image: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    success: true,
    message: "Upload Successfull",
    data: user,
  });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail });
  if (!user) {
    next(new CustomError("There is no user with that email", 400));
  }

  const resetPassToken = user.getResetPasswordToken();

  await user.save();

  const resetPassUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${user.resetPasswordToken}`;

  const emailTemplate = `
  <h3>Reset Your Password</h3>

  <p>This <a href="${resetPassUrl}" target = '_blank'>This click Link</a> will expire in 1 hour </p>

  `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset Your  Password ",
      html: emailTemplate,
    });
    res.json({
      success: true,
      message: "Token Sent To Your Email",
      // data: user,
    });
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return next(new CustomError("Email Could not be sent", 500));
  }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid token", 400));
  }

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid token or session expired", 404));
  }

  user.password = password;

  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  await user.save();

  return res.json({ success: true, message: "Reset Password Successful" });
});

const editProfile = asyncErrorWrapper(async (req, res, next) => {
  const editInfo = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, editInfo, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});
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
  imageUpload,
  forgotPassword,
  resetPassword,
  editProfile,
  // tokenTest,
  getUser,
};
