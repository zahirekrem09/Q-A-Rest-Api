const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Question = require("../../models/Question");
const CustomError = require("../../helpers/error/CustomError");

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;

  const questionId = req.params.id;

  const question = await Question.findById(questionId);

  if (question.user != userId) {
    return next(new CustomError("Only owner can handle this operation", 403));
  }
  next();
});

module.exports = getQuestionOwnerAccess;
