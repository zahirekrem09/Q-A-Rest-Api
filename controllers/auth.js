const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const sendJwtToClient = require("../helpers/auth/sendJwtToClient");

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

module.exports = {
  register,
};
