const jwt = require("jsonwebtoken");
const path = require("path");

const {
  isTokenIncluded,
  getAccessTokenFromHeaders,
} = require("../../helpers/auth/JwtTokenHelpers");

const CustomError = require("../../helpers/error/CustomError");

const getAccessToRoute = (req, res, next) => {
  //token check
  // console.log(req.headers.authorization);
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    //status: 401_unauth  403_ forbidden
    // Custom Error
    next(new CustomError("You are not authorized to access this route", 401));
  }

  const accessToken = getAccessTokenFromHeaders(req);

  // console.log(accessToken);
  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      next(new CustomError("You are not authorized to access this route", 401));
    }
    // console.log(decoded);
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });

  // Custom Error
};

module.exports = getAccessToRoute;
