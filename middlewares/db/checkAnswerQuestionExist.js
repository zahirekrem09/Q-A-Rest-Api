const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");

const checkAnswerQuestionExist = asyncErrorWrapper(async (req, res, next) => {
  const question_id = req.params.question_id;
  const answer_id = req.params.answer_id;

  const answer = await Answer.findOne({
    _id: answer_id,
    question: question_id,
  });
  // console.log(answer);

  if (!answer) {
    return next(
      new CustomError(
        "There is no answer with that id associated question id",
        400
      )
    );
  }
  next();
});

module.exports = checkAnswerQuestionExist;
