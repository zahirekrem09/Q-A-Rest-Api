const sendJwtToClient = (user, res) => {
  //generete jwt
  const token = user.generateJwtFromUser();
  //response
  const { NODE_ENV, JWT_COOKIE } = process.env;
  return res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      access_token: token,
      data: {
        name: user.name,
        email: user.email,
      },
    });
};

module.exports = sendJwtToClient;
