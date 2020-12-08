const Question = require("../../models/Question");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);

  if (!question) {
    return next(new CustomError("There is no such question with that id", 400));
  }
  next();
});

module.exports = checkQuestionExist;
