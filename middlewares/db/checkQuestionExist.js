const Question = require("../../models/Question");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
  const question_id = req.params.id || req.params.question_id;

  // console.log(question_id);
  const question = await Question.findById(question_id);

  if (!question) {
    return next(new CustomError("There is no such question with that id", 400));
  }
  next();
});

module.exports = checkQuestionExist;
