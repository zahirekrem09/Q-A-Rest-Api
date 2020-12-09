const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Question = require("../../models/Question");
const CustomError = require("../../helpers/error/CustomError");
const Answer = require("../../models/Answer");

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;

  const answerId = req.params.answer_id;

  const answer = await Answer.findById(answerId);

  if (answer.user != userId) {
    return next(new CustomError("Only owner can handle this operation", 403));
  }
  next();
});

module.exports = getAnswerOwnerAccess;
